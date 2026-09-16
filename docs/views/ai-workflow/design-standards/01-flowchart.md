# draw.io 流程图绘制规范

> 📦 来源：`wl-skills-design` v0.11.1 · `standards/01-flowchart.md` · 可判定条目由 `verify`（[M] 机械项）自动执行。


> **wl-skills-design · requirements-flowchart**
> 本文档是唯一权威规范来源，工具无关。所有 AI 工具读取此文件作为执行依据。

---

## 一、画布基础设置

```xml
<mxGraphModel
  dx="1665" dy="849"
  grid="1" gridSize="10" guides="1"
  tooltips="1" connect="1" arrows="1" fold="1"
  page="1" pageScale="1"
  pageWidth="1169" pageHeight="827"
  math="0" shadow="0">
```

| 参数 | 值 | 说明 |
|------|----|------|
| gridSize | 10 | 网格 10px，所有坐标对齐到 10px |
| pageWidth × pageHeight | 1169 × 827 | 横版 A4；竖版流程改 827 × 1169 |
| shadow | 0 | 禁止阴影 |
| math | 0 | 禁止数学公式 |

**多 Tab 规则**：Tab 1 固定为「流程标准定义」图例页（用 `skeleton.drawio` 中的图例页），Tab 2 起为实际流程。

---

## 二、泳道容器结构

### 2.1 外层主容器（流程总标题）

```xml
<mxCell id="outer"
  value="&lt;p style=&quot;line-height: 130%;&quot;&gt;
         &lt;font style=&quot;font-size: 22px;&quot;&gt;[流程名称]（[流程编码]）&lt;/font&gt;
         &lt;/p&gt;"
  style="swimlane;html=1;childLayout=stackLayout;resizeParent=1;resizeParentMax=0;
         startSize=30;
         gradientColor=#7ea6e0;fillColor=#dae8fc;strokeColor=#6c8ebf;
         fontSize=15;spacing=2;"
  vertex="1" parent="1">
  <mxGeometry x="30" y="30" width="[总宽]" height="[总高]" as="geometry" />
</mxCell>
```

| 样式属性 | 值 |
|---------|-----|
| fillColor | `#dae8fc` |
| gradientColor | `#7ea6e0` |
| strokeColor | `#6c8ebf` |
| startSize（标题高） | `30` |
| 标题字号 | 22px，line-height: 130% |

### 2.2 子泳道（部门 / 功能域）

```xml
<mxCell id="lane-1"
  value="&lt;span style=&quot;font-size: 18px;&quot;&gt;[部门名称]&lt;/span&gt;"
  style="swimlane;html=1;startSize=25;
         fillColor=#f5f5f5;strokeColor=#666666;gradientColor=#b3b3b3;"
  vertex="1" parent="outer">
  <mxGeometry y="30" width="[子宽]" height="[总高-30]" as="geometry" />
</mxCell>
```

| 规则 | 说明 |
|------|------|
| y 值 | 固定 `30`（= 外层标题高度） |
| 不写 x | 由 `childLayout=stackLayout` 自动水平排列 |
| 各子泳道宽之和 | = 外层容器总宽 |
| 各子泳道高一致 | = 外层容器总高 − 30 |
| 标题字号 | 18px |
| 最小宽度 | 200px |

---

## 三、活动节点（三层 GROUP）

每个操作节点是一个 **3 层垂直 GROUP**，宽度固定 **76.82px**，总高 **54px**。

```
y=0  ┌──────────────────────────────┐ h=12  ← ① 活动编码（白底，10px）
     ├──────────────────────────────┤
y=12 │         活动名称             │ h=30  ← ② 活动内容（模块色，14px）
     ├──────────────────────────────┤
y=42 │          操作岗位            │ h=12  ← ③ 岗位标签（灰底，10px）
     └──────────────────────────────┘
```

### 3.1 完整 XML 模板

```xml
<!-- GROUP 容器 -->
<mxCell id="[id]-g" value="" style="group" connectable="0" vertex="1" parent="[泳道id]">
  <mxGeometry x="[x]" y="[y]" width="76.82" height="54" as="geometry" />
</mxCell>

<!-- ① 活动编码 -->
<mxCell id="[id]-code"
  value="&lt;font style=&quot;font-size: 10px;&quot;&gt;[活动编码]&lt;/font&gt;"
  style="rounded=0;whiteSpace=wrap;html=1;"
  vertex="1" parent="[id]-g">
  <mxGeometry width="76.82" height="12" as="geometry" />
</mxCell>

<!-- ② 活动内容（系统操作示例，色值按模块替换） -->
<mxCell id="[id]-name"
  value="&lt;span style=&quot;font-size: 14px;&quot;&gt;[活动名称]&lt;/span&gt;"
  style="rounded=0;whiteSpace=wrap;html=1;
         fillColor=[模块填充色];strokeColor=[模块边框色];gradientColor=[模块渐变色];
         align=center;verticalAlign=middle;fontFamily=Helvetica;fontSize=12;"
  vertex="1" parent="[id]-g">
  <mxGeometry y="12" width="76.82" height="30" as="geometry" />
</mxCell>

<!-- ③ 操作岗位 -->
<mxCell id="[id]-dept"
  value="&lt;span style=&quot;font-size: 10px;&quot;&gt;[岗位]&lt;/span&gt;"
  style="rounded=0;whiteSpace=wrap;html=1;fontSize=15;
         fillColor=#eeeeee;strokeColor=#36393d;verticalAlign=middle;"
  vertex="1" parent="[id]-g">
  <mxGeometry y="42" width="76.82" height="12" as="geometry" />
</mxCell>
```

> **线下操作**：GROUP 容器整体加 `dashed=1;dashPattern=8 8;`，三层子元素也各自加 `dashed=1;`。

---

## 四、模块色标体系

| 模块 | fillColor | strokeColor | gradientColor | fontColor |
|------|-----------|-------------|---------------|-----------|
| 生产管理 / 物流管理 | `#dae8fc` | `#6c8ebf` | `#7ea6e0` | default |
| 质量管理 | `#cdeb8b` | `#36393d` | — | default |
| 销售管理 / 营销 | `#ffcc99` | `#36393d` | — | default |
| 采购管理 | `#f8cecc` | `#b85450` | — | default |
| 成本管理 | `#ffe6cc` | `#d79b00` | — | default |
| 计量管理 | `#f5f5f5` | `#666666` | — | `#333333` |
| 安防管理 | `#e1d5e7` | `#9673a6` | — | default |
| 安全管理 | `#ffff88` | `#36393d` | — | default |
| IT 开发 / 数据平台 | `#fad9d5` | `#ae4132` | — | default |
| 设备管理 | `#b0e3e6` | `#0e8088` | — | default |
| 能源管理 | `#fff2cc` | `#d6b656` | — | default |
| 环保管理 | `#d5e8d4` | `#82b366` | — | default |
| 业务域 A（可配置） | `#1ba1e2` | `#006EAF` | — | `#ffffff` |
| 业务域 B（可配置） | `#60a917` | `#2D7600` | — | `#ffffff` |
| 外部系统（可配置） | `#e6d0de` | `#996185` | `#d5739d` | default |
| 子流程通用 | `#d5e8d4` | `#82b366` | `#97d077` | default |

> 废钢闭环管理沿用各参与模块色标，不单独配色。

---

## 五、节点形状字典

| 场景 | style 关键属性 | 说明 |
|------|--------------|------|
| 系统操作（在线） | `rounded=0` 矩形 | 最常用 |
| 子流程 / 跨流程引用 | `shape=process;backgroundOutline=1` | 两侧有竖线 |
| 系统表单 / 多文档 | `shape=mxgraph.flowchart.multi-document` | 多页波浪形 |
| 单份单据 | `shape=document` | 单波浪 |
| 逻辑判定 | `rhombus;fillColor=#cdeb8b;strokeColor=#36393d` | 菱形 |
| 开始 / 结束 | `shape=mxgraph.flowchart.terminator;strokeWidth=2;fillColor=#76608a;strokeColor=#432D57;fontColor=#ffffff` | 圆角端点 |
| 移动操作图标 | `shape=mxgraph.office.devices.cell_phone_android_standalone;fillColor=#505050;strokeColor=none` | 纯图标 + 底部文字 |
| 警示提醒图标 | `shape=mxgraph.office.concepts.whats_new;fillColor=#505050;strokeColor=none` | 纯图标 |
| 子流程边界框 | `rounded=1;dashed=1;dashPattern=8 8;fillColor=none;strokeColor=[模块边框色]` | 圆角虚线框 |

### 开始 / 结束节点模板

```xml
<mxCell id="flow-start" value="开始"
  style="strokeWidth=2;html=1;shape=mxgraph.flowchart.terminator;
         whiteSpace=wrap;fillColor=#76608a;strokeColor=#432D57;fontColor=#ffffff;"
  vertex="1" parent="[泳道id]">
  <mxGeometry x="[x]" y="[y]" width="61" height="20" as="geometry" />
</mxCell>
```

---

## 六、连接线规范

### 6.1 主流程线（标准）

```xml
<mxCell id="[edge-id]"
  style="edgeStyle=orthogonalEdgeStyle;rounded=0;
         orthogonalLoop=1;jettySize=auto;html=1;
         exitX=0.5;exitY=1;exitDx=0;exitDy=0;
         entryX=0.5;entryY=0;entryDx=0;entryDy=0;"
  edge="1" source="[源节点-name层id]" target="[目标节点-code层id]"
  parent="[共同父容器id]">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

| 规则 | 值 |
|------|-----|
| 线型 | `edgeStyle=orthogonalEdgeStyle`（直角折线，禁止斜线） |
| 圆角 | `rounded=0` |
| 主流方向 | 上→下：exitY=1 → entryY=0 |
| 水平流 | 左→右：exitX=1 → entryX=0 |
| source | **指向 name 层**（`[id]-name`），exit 从 name 层底/侧出 |
| target | **指向 code 层**（`[id]-code`），entry 从 code 层顶/侧入 |
| 跨泳道 parent | ⚠️ 必须为**外层主容器 id**，不是子泳道 id |

### 6.2 跨泳道粗箭头（系统边界数据传递）

```xml
<mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;
               orthogonalLoop=1;jettySize=auto;html=1;shape=flexArrow;"
  edge="1" parent="[父容器id]">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="[x1]" y="[y1]" as="sourcePoint" />
    <mxPoint x="[x2]" y="[y2]" as="targetPoint" />
  </mxGeometry>
</mxCell>
```

### 6.3 判定分支标签（必须）

菱形节点每条出线都必须有标注：

```xml
<mxCell value="是" style="edgeLabel;html=1;align=center;verticalAlign=middle;
               resizable=0;points=[];"
  connectable="0" vertex="1" parent="[连接线id]">
  <mxGeometry x="-0.2" y="-1" relative="1" as="geometry">
    <mxPoint as="offset" />
  </mxGeometry>
</mxCell>
```

### 6.4 绕行折点（避让）

当连接线需要绕过障碍节点时，用 `mxPoint` 手动加折点：

```xml
<mxGeometry relative="1" as="geometry">
  <Array as="points">
    <mxPoint x="[绕行x1]" y="[绕行y1]" />
    <mxPoint x="[绕行x2]" y="[绕行y2]" />
  </Array>
</mxGeometry>
```

---

## 七、活动编码规范

> **唯一权威来源**：活动编码的前缀（流程编码）与序号规则以 spec 规范 `.github/standards/06-spec-doc.md` §十.2（流程编码）、§十.3（活动编码）为准。
> 流程图中的活动编码必须与 spec 文档 4.x.2 活动说明表中的编码**逐字一致**（FC-01 跨文档校验）。

### 格式

```
[流程编码] - [操作类型] - [活动编号]
   见 spec §十.2      1位字母      2位数字
```

其中 `[流程编码]` = `[子模块代码]-A-[NN]`（spec §十.2），故活动编码完整形如 `[子模块代码]-A-[NN]-[操作类型]-[MM]`。

### 示例解析：`BASE-A-02-E-01`

| 部分 | 值 | 含义 |
|------|----|------|
| 流程编码 | `BASE-A-02` | 物料主数据子模块第 2 个流程（spec §十.2）|
| 操作类型 | `E` | 业务平台操作 |
| 活动编号 | `01` | 该流程第 1 个活动 |

### 操作类型标识

> spec 4.x.2 系统在线活动统一使用 `E`；当流程图需表达异质系统/线下作业活动时，使用 `C` / `M`，且这些活动须同样登记在 spec 4.x.2 活动说明表中（线下活动在 4.x.3 对照表标注「线下操作（无系统支持）」）。

| 标识 | 含义 |
|------|------|
| `E` | 业务平台（系统在线操作） |
| `C` | 异质系统（第三方/外部系统） |
| `M` | 人工作业（线下/手动） |

### 流程（模型）编码

```
[流程编码] = [子模块代码]-A-[NN]   （spec §十.2）
例：BASE-A-02（物料主数据子模块第 2 个流程）
```

---

## 八、视觉质量规则

### 8.1 间距

| 规则 | 数值 |
|------|------|
| 同列节点步距（Y 差值） | ≥ 80px（节点高 54 + 间隔 ≥ 26） |
| 同行节点列距（X 差值） | ≥ 100px（节点宽 76.82 + 间隔 ≥ 23） |
| GROUP 边界最小净空 | 10px |

### 8.2 对齐

- 同一泳道主流程节点：X 坐标居中对齐
- 跨泳道同层节点：Y 坐标对齐

### 8.3 字体规范

| 位置 | 字号 | 字体 |
|------|------|------|
| 外层容器标题 | 22px | 默认 |
| 子泳道标题 | 18px | 默认 |
| 节点活动名称（中层） | 14px | Helvetica |
| 节点编码（顶层） | 10px | 默认 |
| 节点岗位（底层） | 10px | 默认 |
| 数据节点文字 | 8–10px | 默认 |

### 8.4 禁止事项

| 禁止 | 说明 |
|------|------|
| ❌ 节点重叠 | geometry 边界不得相交 |
| ❌ 线条压盖文字 | 连接线必须绕行或转折避开 |
| ❌ 斜线 | 只允许直角折线 |
| ❌ 色标串色 | 同一流程域内只用该域色标 |
| ❌ 开始/结束彩色 | 固定紫色 `#76608a` |
| ❌ 判定无标签 | 所有分支线必须标「是/否」或业务语义 |
| ❌ 编码层为空 | 每个节点必须有活动编码 |

---

## 九、子流程边界框

将同一子流程内的多个节点用虚线圆角矩形圈住：

```xml
<mxCell value="" style="rounded=1;whiteSpace=wrap;html=1;
         dashed=1;dashPattern=8 8;
         fillColor=none;strokeColor=[模块边框色];strokeWidth=1.5;"
  vertex="1" parent="[泳道id]">
  <mxGeometry x="[x]" y="[y]" width="[w]" height="[h]" as="geometry" />
</mxCell>
```

> 边界框 z-order 必须低于内部节点，不遮挡任何文字。节点各方向与框边距 ≥ 10px。

---

## 十、数据 / 文档节点

独立于操作节点，置于产生它的节点右侧或下方偏右，不接入主流程连接线：

```xml
<!-- 多份文档 -->
<mxCell value="[文档名]"
  style="html=1;shape=mxgraph.flowchart.multi-document;whiteSpace=wrap;
         fillColor=[模块色];strokeColor=#36393d;
         rounded=0;align=center;verticalAlign=middle;fontSize=9;"
  vertex="1" parent="[泳道id]">
  <mxGeometry x="[x]" y="[y]" width="50" height="22" as="geometry" />
</mxCell>
```

---

## 十一、跨流程引用规则

当一个流程调用另一个已有流程时，使用 **子流程节点**（shape=process）而非普通矩形：

```xml
<!-- ② 层改为 process 形状 -->
<mxCell id="[id]-name"
  value="&lt;span style=&quot;font-size: 14px;&quot;&gt;[被引流程名]&lt;/span&gt;"
  style="shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;
         fillColor=#d5e8d4;strokeColor=#82b366;gradientColor=#97d077;"
  vertex="1" parent="[id]-g">
  <mxGeometry y="12" width="76.82" height="38" as="geometry" />
</mxCell>
```

> 编码层（① 层）显示被引流程的编码（如 `BASE-A-02`），岗位层（③ 层）显示执行部门。
> 活动编码格式：`[流程编码]-[操作类型]-[NN]`（spec §十.3），如 `BASE-A-02-E-01`。

---

## 十二、已有文件修改规则

在已有 .drawio 文件中追加或修改时：

1. **不改动 ID** — 已有 mxCell id 不得修改，避免连接线断裂
2. **新增节点使用新 ID** — 格式：`[流程前缀]-[序号]-[层标识]`，如 `n12-g`、`n12-code`
3. **插入节点时调整坐标** — 后续节点 y 坐标整体下移，保持 ≥ 80px 步距
4. **修改色标** — 只改 ② 层（name 层）的 style，不改 ① 和 ③ 层
5. **增加泳道** — 在 outer 容器末尾追加，更新 outer 总宽

---

## 十三、图例页要求（Tab 1 固定）

每个 .drawio 文件第一个 Tab 必须是标准图例页，包含：

1. 三层节点结构示意（系统操作 / 子流程 / 线下操作）
2. 开始/结束节点样式
3. 判定菱形样式
4. 所有模块色标（色块 + 名称）
5. 连接线类型示例（主流程线 / 数据标注线）
6. 活动编码格式说明

> 使用 `wl-skills-design/requirements-flowchart/templates/skeleton.drawio` 中的图例页直接复用。

---

## 十四、最小完整示例（两节点流）

```xml
<mxfile host="Electron" version="27.0.9" pages="2">
  <diagram id="legend" name="流程标准定义">
    <!-- 使用 skeleton.drawio 中的图例页内容 -->
  </diagram>
  <diagram id="main" name="示例流程（DEMO-A-01）">
    <mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1"
      tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1"
      pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0" /><mxCell id="1" parent="0" />

        <!-- 外层容器 -->
        <mxCell id="outer"
          value="&lt;p style=&quot;line-height: 130%;&quot;&gt;&lt;font style=&quot;font-size: 22px;&quot;&gt;示例流程（DEMO-A-01）&lt;/font&gt;&lt;/p&gt;"
          style="swimlane;html=1;childLayout=stackLayout;resizeParent=1;resizeParentMax=0;startSize=30;gradientColor=#7ea6e0;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=15;spacing=2;"
          vertex="1" parent="1">
          <mxGeometry x="30" y="30" width="400" height="500" as="geometry" />
        </mxCell>

        <!-- 子泳道 -->
        <mxCell id="lane"
          value="&lt;span style=&quot;font-size: 18px;&quot;&gt;部门A&lt;/span&gt;"
          style="swimlane;html=1;startSize=25;fillColor=#f5f5f5;strokeColor=#666666;gradientColor=#b3b3b3;"
          vertex="1" parent="outer">
          <mxGeometry y="30" width="400" height="470" as="geometry" />
        </mxCell>

        <!-- 开始 -->
        <mxCell id="s1" value="开始"
          style="strokeWidth=2;html=1;shape=mxgraph.flowchart.terminator;whiteSpace=wrap;fillColor=#76608a;strokeColor=#432D57;fontColor=#ffffff;"
          vertex="1" parent="lane">
          <mxGeometry x="170" y="30" width="61" height="20" as="geometry" />
        </mxCell>

        <!-- 节点1 -->
        <mxCell id="n1-g" value="" style="group" connectable="0" vertex="1" parent="lane">
          <mxGeometry x="162" y="90" width="76.82" height="54" as="geometry" />
        </mxCell>
        <mxCell id="n1-code" value="&lt;font style=&quot;font-size: 10px;&quot;&gt;DEMO-E-01&lt;/font&gt;"
          style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="n1-g">
          <mxGeometry width="76.82" height="12" as="geometry" />
        </mxCell>
        <mxCell id="n1-name" value="&lt;span style=&quot;font-size: 14px;&quot;&gt;第一步操作&lt;/span&gt;"
          style="rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;gradientColor=#7ea6e0;align=center;verticalAlign=middle;fontFamily=Helvetica;fontSize=12;"
          vertex="1" parent="n1-g">
          <mxGeometry y="12" width="76.82" height="30" as="geometry" />
        </mxCell>
        <mxCell id="n1-dept" value="&lt;span style=&quot;font-size: 10px;&quot;&gt;操作岗位&lt;/span&gt;"
          style="rounded=0;whiteSpace=wrap;html=1;fontSize=15;fillColor=#eeeeee;strokeColor=#36393d;verticalAlign=middle;"
          vertex="1" parent="n1-g">
          <mxGeometry y="42" width="76.82" height="12" as="geometry" />
        </mxCell>

        <!-- 结束 -->
        <mxCell id="e1" value="结束"
          style="strokeWidth=2;html=1;shape=mxgraph.flowchart.terminator;whiteSpace=wrap;fillColor=#76608a;strokeColor=#432D57;fontColor=#ffffff;"
          vertex="1" parent="lane">
          <mxGeometry x="170" y="190" width="61" height="20" as="geometry" />
        </mxCell>

        <!-- 连接：开始→节点1 -->
        <mxCell id="edge-s1-n1"
          style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;"
          edge="1" source="s1" target="n1-code" parent="lane">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- 连接：节点1→结束 -->
        <mxCell id="edge-n1-e1"
          style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;"
          edge="1" source="n1-name" target="e1" parent="lane">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 十五、验证清单（20 项）

绘制完成必须逐项核查：

> 执行方式标记：[M] 机械可判、[J] 语义判断。四域 [M] 项均由 `wl-skills-design verify` 执行（未覆盖时输出 skip）；Agent 先取机械结论，再判 [J] 项，合并为同一编号的报告。


**视觉与结构（15项）**
- [ ] **F01** [M]. 文件有 Tab 1「流程标准定义」图例页
- [ ] **F02** [M]. 外层容器使用蓝色泳道（`fillColor=#dae8fc`，标题 22px）
- [ ] **F03** [M]. 子泳道使用灰色（`fillColor=#f5f5f5`，标题 18px）
- [ ] **F04** [M]. 每个操作节点都是 3 层 GROUP（编码 / 名称 / 岗位）
- [ ] **F05** [M]. 节点 GROUP 宽度 76.82px，总高 54px
- [ ] **F06** [M]. 编码层：10px 字体，白底（无 fillColor）
- [ ] **F07** [M]. 名称层：14px 字体，颜色匹配对应模块色标
- [ ] **F08** [M]. 岗位层：10px 字体，`fillColor=#eeeeee`
- [ ] **F09** [M]. 开始/结束节点颜色正确（`fillColor=#76608a`）
- [ ] **F10** [M]. 所有判定菱形都有「是/否」或业务语义标签
- [ ] **F11** [M]. 所有连接线使用直角折线（`edgeStyle=orthogonalEdgeStyle`）
- [ ] **F12** [M]. 无节点几何重叠（x/y/w/h 无交叉）
- [ ] **F13** [M]. 线下操作节点有虚线样式（`dashed=1`）
- [ ] **F14** [M]. 活动编码格式符合 spec §十.3：`[流程编码]-[操作类型]-[NN]`（如 `BASE-A-02-E-01`）
- [ ] **F15** [J]. 模块色标使用正确，无串色

**跨文档一致性（5项，与 spec 文档联动时执行）**
- [ ] **FC-01** [M] — 流程图中每个活动节点的活动编码，与对应 spec 文档 4.x.2 活动说明表中的编码完全一致（无多余编码、无遗漏编码）
- [ ] **FC-02** [M] — 流程图所有泳道（岗位/部门名称），与 spec 文档 2.2 岗位定义表中的岗位名称完全匹配（字面完全相同）
- [ ] **FC-03** [M] — 流程图系统活动节点数量，与 spec 4.x.3 对照表中非「线下操作」的行数一致
- [ ] **FC-04** [M] — 流程编码格式符合 `[MODULE]-A-[NN]`（如 PLAN-A-01），无自定义格式
- [ ] **FC-05** [M] — 同一流程内活动编码从 E-01 起连续递增，无跳号、无重复

---

## 十六、跨文档一致性规则（与需求设计说明书联动）

> 流程图与需求设计说明书之间存在**三张编号的锚点链路**，生成/修改时两端必须同步。

### 16.1 流程图 ↔ spec 文档的五条规则

> FC-01～FC-03 需与 spec 配对执行；单独验证流程图时输出 skip，不判失败。

| 规则编号 | 规则描述 | 检查方式 |
|---------|---------|---------|
| FC-01 | 流程图活动节点的活动编码 = spec 4.x.2 活动说明表中的活动编码 | 从 XML 提取所有活动节点的编码层文字，与 spec 4.x.2 比对 |
| FC-02 | 流程图泳道名称 = spec 2.2 岗位定义表岗位名称 | 提取所有 `<swimlane value="...">` 文字，与 spec §2.2 比对 |
| FC-03 | 流程图系统活动节点数 = spec 4.x.3 对照表行数（不含线下行）| 统计非虚线节点数，与对照表有系统支持的行数比对 |
| FC-04 | 流程编码格式符合 `[MODULE]-A-[NN]` | 正则 `^[A-Z]{4}-A-\d{2}$` 检查 |
| FC-05 | 活动编码在流程内连续：E-01、E-02、E-03... | 提取所有 E-NN 编码排序，检查是否连续递增无跳号 |

### 16.2 编码冲突处理原则

当流程图编码与 spec 文档编码不一致时：

1. **spec 文档为准**（spec 是需求权威来源，流程图是 spec 的可视化）
2. 若 spec 尚未生成，流程图使用占位符 `[TBD-E-01]`，待 spec 生成后回填并重新执行验证清单第 16～20 项
3. **禁止**在流程图中新增 spec 中未定义的活动编码（须先在 spec 中增加活动定义）

---

## 十七、闭环修复协议（绘制 → 验证 → 修复 → 复验）

### 阶段1：验证

完成绘制后，执行验证清单 20 项，记录所有 ❌ 失败项。

### 阶段2：修复

按以下优先级处理失败项：

| 优先级 | 失败项 | 修复动作 |
|--------|--------|---------|
| P0（必修）| 16～20（跨文档一致性）| 以 spec 文档为准修正流程图编码/岗位名称 |
| P1（必修）| 4～8（三层 GROUP 结构）| 重建 GROUP XML 结构，补齐三层 |
| P1（必修）| 14（编码格式）| 修正编码格式为标准正则格式 |
| P2（应修）| 1～3（图例/容器色）| 补充图例页，修正 fillColor 值 |
| P2（应修）| 10～11（标签/线型）| 补充菱形标签，修正 edgeStyle |
| P3（建议）| 12（节点重叠）| 调整 x/y 坐标保证 ≥80px 步距 |

### 阶段3：复验

修复完成后重新执行全 20 项，全部通过后方可提交。

> **⚠️ 若 spec 文档尚未生成**：跳过第 16～20 项（标记为「暂挂-Pending」），待 spec 生成后补充验证。
