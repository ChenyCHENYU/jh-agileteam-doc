# 路由权限与状态管理

> 动态路由、按钮级权限与 Pinia 模块化——前端「谁能看、能点、记住什么」的三件套。

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu','MaJiaRui']" />

> 本文是 [架构设计总览](../architecture) 的专项页，章节编号与总览保持一致。

## 5. 路由与权限架构

### 5.1 动态路由生成

**架构流程**：

```
┌────────────┐      ┌────────────┐      ┌────────────┐
│ 用户登录   │ ───> │ 获取菜单   │ ───> │ 生成路由   │
│            │      │ (API)      │      │ (前端)     │
└────────────┘      └────────────┘      └────────────┘
                                              │
                                              ▼
                    ┌──────────────────────────────────┐
                    │ 动态注册到 Vue Router            │
                    │ router.addRoute(route)           │
                    └──────────────────────────────────┘
```

**实现位置**：`src/permission.ts`

```typescript
import { fetchRemoteComponent } from "@/util/system";
import { getToken } from "@jhlc/common-core/src/util/auth";
import user from "@jhlc/common-core/src/store/user";

const router = await fetchRemoteComponent("public", "./router/index.ts");
const usePermissionStore = await fetchRemoteComponent(
  "public",
  "./store/modules/permission.ts"
);

router.beforeEach(async (to, from, next) => {
  const permissionStore = usePermissionStore();
  const userStore = user();
  
  // 1. Token 验证
  if (getToken()) {
    // 2. 获取用户信息
    if (!fetchUserFlag) {
      fetchUserFlag = true;
      await userStore.getUserInfo();
    }
    
    // 3. 生成路由
    if (!permissionStore.generated) {
      permissionStore.generated = true;
      
      // 优先注册当前菜单，异步注册其他子系统
      await permissionStore.generateCurrentRoute(to);
      permissionStore.generateRoutes(to);
      permissionStore.isRouterGenerated = true;
      
      return next({ ...to, replace: true });
    }
    else {
      return next();
    }
  }
  else {
    // 白名单路由直接放行
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`);
    }
  }
});
```

**路由配置示例**：

```typescript
// 后端返回的菜单数据
{
  "menuId": "1001",
  "menuName": "订单管理",
  "path": "/sale/order/list",
  "component": "saleApp/sale/order/list/index.vue", // 微前端路径
  "permissions": ["sale:order:list"]
}

// 前端生成的路由
{
  path: "/sale/order/list",
  name: "SaleOrderList",
  component: () => import("saleApp/sale/order/list/index.vue"), // 动态 import
  meta: {
    title: "订单管理",
    permissions: ["sale:order:list"]
  }
}
```

### 5.2 权限控制

**1. 路由权限**

```typescript
// 路由守卫中检查权限
router.beforeEach((to, from, next) => {
  const userStore = user();
  const permissions = to.meta.permissions;
  
  if (permissions && !userStore.hasPermission(permissions)) {
    // 无权限，跳转到 403 页面
    next("/403");
  } else {
    next();
  }
});
```

**2. 按钮权限指令**

```vue
<template>
  <!-- 使用 v-permission 指令 -->
  <el-button v-permission="['sale:order:add']" @click="handleAdd">
    新增
  </el-button>
  
  <!-- 或使用 v-if 判断 -->
  <el-button v-if="hasPermission('sale:order:edit')" @click="handleEdit">
    编辑
  </el-button>
</template>

<script setup lang="ts">
import { hasPermission } from "@jhlc/common-core/src/util/permission";
</script>
```

**3. 数据权限**

```typescript
// API 调用时自动带上数据权限参数
const res = await getOrderList({
  page: 1,
  pageSize: 20,
  // 后端根据用户权限自动过滤数据
});
```

### 5.3 菜单配置

**系统管理中配置菜单**：

| 字段         | 说明                           | 示例                                    |
| ------------ | ------------------------------ | --------------------------------------- |
| **菜单名称** | 显示在侧边栏的名称             | 订单管理                                |
| **路由地址** | 前端路由路径                   | `/sale/order/list`                      |
| **组件路径** | 微前端组件路径（关键）         | `saleApp/sale/order/list/index.vue`     |
| **权限标识** | 权限控制标识                   | `sale:order:list`                       |
| **菜单类型** | 目录、菜单、按钮               | 菜单                                    |
| **排序**     | 菜单顺序                       | 1                                       |
| **图标**     | 菜单图标                       | `el-icon-document`                      |

**组件路径规范**：

```
{应用名}/{领域}/{子系统}/{模块}/{页面}.vue

示例：
saleApp/sale/order/list/index.vue
saleApp/sale/customer/form/index.vue
produceApp/produce/plan/list/index.vue
```

**注意**：

- 应用名必须与 Module Federation 配置的 `name` 一致
- 页面必须在 `vite/plugins/shared/pages.ts` 中配置暴露

---

---

## 6. 状态管理架构

### 6.1 Pinia Store 设计

**Store 分类**：

```
stores/
├── user.ts           # 用户 Store（用户信息、Token、权限）
├── permission.ts     # 权限 Store（菜单、路由、权限）
├── app.ts            # 应用 Store（全局状态、主题、语言）
├── settings.ts       # 设置 Store（侧边栏、标签页、布局）
└── modules/
    ├── order.ts      # 订单 Store（业务状态）
    └── customer.ts   # 客户 Store（业务状态）
```

**Store 定义规范**：

```typescript
// src/stores/modules/order.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getOrderList } from "@/api/order";

export const useOrderStore = defineStore(
  "order", // Store ID
  () => {
    // ==================== 1. 状态定义 ====================
    const orderList = ref([]);
    const currentOrder = ref(null);
    const loading = ref(false);
    
    // ==================== 2. 计算属性 ====================
    const totalAmount = computed(() => {
      return orderList.value.reduce((sum, item) => sum + item.amount, 0);
    });
    
    // ==================== 3. 方法定义 ====================
    const fetchOrderList = async (params: any) => {
      loading.value = true;
      try {
        const res = await getOrderList(params);
        orderList.value = res.data.records;
      } finally {
        loading.value = false;
      }
    };
    
    const setCurrentOrder = (order: any) => {
      currentOrder.value = order;
    };
    
    const resetStore = () => {
      orderList.value = [];
      currentOrder.value = null;
      loading.value = false;
    };
    
    // ==================== 4. 返回（暴露） ====================
    return {
      // 状态
      orderList,
      currentOrder,
      loading,
      
      // 计算属性
      totalAmount,
      
      // 方法
      fetchOrderList,
      setCurrentOrder,
      resetStore
    };
  },
  {
    // ==================== 5. 持久化配置 ====================
    persist: {
      key: "order-store",
      storage: localStorage,
      paths: ["currentOrder"] // 只持久化部分状态
    }
  }
);
```

### 6.2 状态持久化

**使用插件**：`pinia-plugin-persistedstate`

**配置位置**：Store 定义时配置

```typescript
import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user",
  () => {
    const token = ref("");
    const userInfo = ref({});
    
    return { token, userInfo };
  },
  {
    persist: {
      key: "user-store",        // localStorage 的 key
      storage: localStorage,     // 存储方式（localStorage/sessionStorage）
      paths: ["token", "userInfo"] // 持久化字段（可选，默认全部）
    }
  }
);
```

**持久化策略**：

| Store            | 持久化   | 存储方式        | 持久化字段               | 说明               |
| ---------------- | -------- | --------------- | ------------------------ | ------------------ |
| **user**         | ✅       | localStorage    | token, userInfo          | 用户登录态必须持久化 |
| **permission**   | ✅       | sessionStorage  | routes, menus            | 刷新页面需重新获取 |
| **app**          | ✅       | localStorage    | theme, language, sidebar | 用户偏好设置       |
| **order**        | ❌       | -               | -                        | 业务状态无需持久化 |

### 6.3 Store 最佳实践

**1. 使用 Composition API 风格**

```typescript
// ✅ 推荐：Composition API 风格（更灵活）
export const useUserStore = defineStore("user", () => {
  const token = ref("");
  const setToken = (newToken: string) => {
    token.value = newToken;
  };
  
  return { token, setToken };
});

// ❌ 不推荐：Options API 风格
export const useUserStore = defineStore("user", {
  state: () => ({ token: "" }),
  actions: {
    setToken(newToken) {
      this.token = newToken;
    }
  }
});
```

**2. Store 职责分离**

```typescript
// ✅ 按业务领域划分 Store
useOrderStore()   // 订单相关状态
useCustomerStore() // 客户相关状态

// ❌ 一个 Store 包含所有业务状态
useBusinessStore() // 混杂了订单、客户、合同等
```

**3. 避免状态冗余**

```typescript
// ✅ 使用计算属性派生状态
const totalAmount = computed(() => {
  return orderList.value.reduce((sum, item) => sum + item.amount, 0);
});

// ❌ 维护冗余状态
const totalAmount = ref(0);
watch(orderList, () => {
  totalAmount.value = orderList.value.reduce((sum, item) => sum + item.amount, 0);
});
```

**4. 组件中使用 Store**

```vue
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();

// ✅ 使用 storeToRefs 保持响应式
const { token, userInfo } = storeToRefs(userStore);

// ✅ 方法直接解构（方法不需要保持响应式）
const { setToken, logout } = userStore;
</script>
```

---
