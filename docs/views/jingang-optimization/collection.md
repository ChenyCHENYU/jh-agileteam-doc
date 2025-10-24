# 菜单导航收藏功能

> 在菜单导航页面实现了完整的收藏功能，用户可以收藏常用的菜单项，方便快速访问。

<AuthorTag author="CHENY" />


## 实现要点

- 菜单项收藏/取消收藏
- 收藏列表展示（顶部独立区域）
- 数据持久化（后端存储）
- 页面刷新后数据保持

##  技术要点

### 1. API 层设计

**文件位置**：`src/api/favoriteMenu.ts`

```typescript
import {
  getAction,
  postAction,
  deleteAction,
} from "@jhlc/common-core/src/api/action";

// 获取收藏列表
export function getFavoriteMenuList() {
  return getAction("system/oaFavoriteMenu/list");
}

// 添加收藏
export function saveFavoriteMenu(data: { menuId: string; jobNumber: string }) {
  return postAction("system/oaFavoriteMenu/save", data);
}

// 取消收藏
export function removeFavoriteMenu(data: {
  id: string;
  menuId: string;
  jobNumber: string;
}) {
  return deleteAction("system/oaFavoriteMenu/remove", data);
}
```

**设计原则**：

- ✅ 使用公共库 `@jhlc/common-core` 的 HTTP 方法
- ✅ 封装业务语义，提高代码可读性
- ✅ TypeScript 类型约束，减少错误

### 2. 组件逻辑实现

**文件位置**：`src/views/menuNav/index.vue`

#### 状态管理

```typescript
// 收藏的菜单 ID 集合（用于快速查找）
const favoriteMenuIds = ref<Set<string>>(new Set());

// menuId -> 收藏记录 ID 的映射（删除时需要）
const favoriteMenuDataIds = ref<Map<string, string>>(new Map());

// 收藏的菜单项列表（用于展示）
const favoriteMenus = ref<MenuItem[]>([]);
```

**数据结构选择**：

- `Set<string>`：O(1) 时间复杂度判断是否收藏
- `Map<string, string>`：快速获取收藏记录 ID（删除接口需要）
- `MenuItem[]`：完整菜单信息，用于渲染收藏区域

#### 核心方法

##### 1. 加载收藏列表

```typescript
const loadFavoriteMenus = async () => {
  try {
    const res = await getFavoriteMenuList();

    // 兼容多种响应格式
    const records = res?.data?.records || res?.data || [];

    // 成功状态判断（兼容不同后端）
    if (res?.success === true || res?.code === 2000) {
      favoriteMenuIds.value.clear();
      favoriteMenuDataIds.value.clear();
      favoriteMenus.value = [];

      records.forEach((item: any) => {
        // 构建收藏数据
        favoriteMenuIds.value.add(item.menuId);
        favoriteMenuDataIds.value.set(item.menuId, item.id);

        // 从完整菜单树中查找对应的菜单项
        const menuItem = findMenuItemById(item.menuId);
        if (menuItem) {
          favoriteMenus.value.push(menuItem);
        }
      });
    }
  } catch (error) {
    console.error("加载收藏列表失败:", error);
  }
};
```

##### 2. 判断是否收藏

```typescript
const isFavorite = (menuId: string) => {
  return favoriteMenuIds.value.has(menuId);
};
```

**性能优化**：使用 Set 的 O(1) 查找时间

##### 3. 切换收藏状态

```typescript
const toggleFavorite = async (event: Event, menu: MenuItem) => {
  event.preventDefault();
  event.stopPropagation();

  const menuId = menu.id;
  const jobNumber = userInfo.value.jobNumber;

  if (isFavorite(menuId)) {
    // 取消收藏
    const favoriteId = favoriteMenuDataIds.value.get(menuId);
    if (!favoriteId) return;

    const res = await removeFavoriteMenu({
      id: favoriteId,
      menuId,
      jobNumber,
    });

    if (res?.success === true || res?.code === 2000) {
      favoriteMenuIds.value.delete(menuId);
      favoriteMenuDataIds.value.delete(menuId);
      favoriteMenus.value = favoriteMenus.value.filter((m) => m.id !== menuId);
      ElMessage.success("取消收藏成功");
    }
  } else {
    // 添加收藏
    const res = await saveFavoriteMenu({ menuId, jobNumber });

    if (res?.success === true || res?.code === 2000) {
      const favoriteId = res?.data?.id || res?.data;

      favoriteMenuIds.value.add(menuId);
      favoriteMenuDataIds.value.set(menuId, favoriteId);
      favoriteMenus.value.push(menu);
      ElMessage.success("收藏成功");
    }
  }
};
```

**注意事项**：

- 阻止事件冒泡：避免触发菜单项点击
- 保存收藏记录 ID：删除时必需
- 同步更新三个状态：`favoriteMenuIds`、`favoriteMenuDataIds`、`favoriteMenus`

#### 生命周期

```typescript
onMounted(() => {
  loadMenuData();
});

const loadMenuData = async () => {
  // 加载菜单数据...

  // 菜单数据加载完成后，加载收藏列表
  await nextTick();
  loadFavoriteMenus();
};
```

**时序控制**：必须等菜单数据加载完成，才能查找收藏的菜单项

### 3. 模板结构

#### 我的收藏区域

```vue
<div v-if="favoriteMenus.length > 0" class="favorite-section">
  <div class="section-header">
    <el-icon class="section-icon">
      <Star />
    </el-icon>
    <h2 class="section-title">我的收藏</h2>
  </div>

  <div class="favorite-grid">
    <div
      v-for="menu in favoriteMenus"
      :key="menu.id"
      class="favorite-item"
      @click="handleMenuClick(menu)"
    >
      <el-icon class="favorite-icon">
        <component :is="menu.meta?.icon || 'Menu'" />
      </el-icon>
      <div class="favorite-name">{{ menu.meta?.title || menu.name }}</div>
    </div>
  </div>
</div>
```

#### 收藏按钮（在菜单项上）

```vue
<div class="feature-link-wrapper">
  <router-link :to="item.path" class="feature-link">
    <!-- 菜单图标和标题 -->
  </router-link>

  <div
    class="favorite-button"
    :class="{ 'is-favorite': isFavorite(item.id) }"
    @click="toggleFavorite($event, item)"
  >
    <el-icon class="star-icon" :class="{ active: isFavorite(item.id) }">
      <component :is="isFavorite(item.id) ? StarFilled : Star" />
    </el-icon>
  </div>
</div>
```


## 关键注意事项

### 1. 数据加载时序问题

**问题**：如果在菜单数据加载前调用 `loadFavoriteMenus()`，会导致找不到菜单项。

**解决方案**：

```typescript
const loadMenuData = async () => {
  // 加载菜单...
  await nextTick(); // 等待 DOM 更新
  loadFavoriteMenus(); // 再加载收藏
};
```

### 2. API 响应格式兼容

**问题**：不同后端可能返回不同的数据结构。

**解决方案**：多重兼容判断

```typescript
// 数据获取
const records = res?.data?.records || res?.data || [];

// 成功判断
if (res?.success === true || res?.code === 2000) {
}
```

### 3. 删除接口参数

**问题**：删除接口需要收藏记录的 ID，而不是菜单 ID。

**解决方案**：使用 Map 存储映射关系

```typescript
favoriteMenuDataIds.value.set(menuId, favoriteId);

// 删除时获取
const favoriteId = favoriteMenuDataIds.value.get(menuId);
```

### 4. 事件冒泡处理

**问题**：点击收藏按钮会触发菜单项的路由跳转。

**解决方案**：

```typescript
const toggleFavorite = (event: Event, menu: MenuItem) => {
  event.preventDefault(); // 阻止默认行为
  event.stopPropagation(); // 阻止冒泡
  // ...
};
```
## API 调用模式建议

项目中存在三种 API 调用方式:

### 方式对比

| 方式               | 示例                            | 适用场景         | 推荐度     |
| ------------------ | ------------------------------- | ---------------- | ---------- |
| **直接调用公共库** | `getAction(url, params)`        | 一次性、临时调用 | ⭐⭐⭐     |
| **封装 API 文件**  | `getFavoriteMenuList()`         | 业务功能、需复用 | ⭐⭐⭐⭐⭐ |
| **本地 action.ts** | 仅用于项目特有工具（如 upload） | 特殊工具方法     | ⭐⭐⭐⭐   |

### 最佳实践

```typescript
// ✅ 推荐：封装业务 API（使用公共库）
// src/api/favoriteMenu.ts
import { getAction } from "@jhlc/common-core/src/api/action";

export function getFavoriteMenuList() {
  return getAction("system/oaFavoriteMenu/list");
}

// ✅ 组件中使用
import { getFavoriteMenuList } from "@/api/favoriteMenu";
```

**优势**：

- ✅ 使用公司统一维护的公共库
- ✅ 业务语义清晰，函数名表达意图
- ✅ 参数类型约束，减少错误
- ✅ 版本统一，易于维护
