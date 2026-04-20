# ③ 接口约定

**Skill 名称**：`api-contract`

**触发词**：`生成接口`、`接口约定`

**规则文件**：`.github/skills/api-contract/skills.md`

---

## 功能

基于接口规格，生成 TypeScript 接口定义文件（`api/*.ts`），遵循项目命名约定。

---

## 命名约定

```ts
get{Module}List()      // 列表查询
get{Module}Detail()    // 详情查询
add{Module}()          // 新增
update{Module}()       // 修改
delete{Module}()       // 删除
```

---

## 输出文件

```
src/api/{module}.ts
```

使用 `@miracle-web/utils` 的 MAxios 封装，项目内 `@/utils/http` 提供 `get` / `post` / `put` / `del` 快捷方法。

---

## 上下游

- 上游：[② 接口规格](./api-spec)
- 下游：[④ 页面代码生成](./page-codegen)
