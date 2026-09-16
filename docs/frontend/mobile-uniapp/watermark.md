# 图片水印能力（服务端契约）

<AuthorTag :authors="['CHENY']" />

> 📦 来源：`wl-mbase` v1.0.6 `docs/图片水印能力与服务端接入.md`。watermarkPolicy / buildWatermarkFormData / failureMode 防静默上传原图——@robot-h5/core v1.2.0 起内置。
## 一、结论

图片水印采用“子应用决定是否启用、基座沿用原上传、服务端生成最终水印图”的分层方案。

- 支持相机新拍照片、手机相册历史照片和系统内既有原图。
- 未启用时不发送水印字段，现有上传行为不变。
- 基座不读取或修改钉钉虚拟路径，不影响原生拍照/相册直传。
- 原图永久保留，水印图作为衍生文件；重试不能产生双重水印。
- 用户、公司、上传时间等可信字段由服务端生成。

## 二、端到端流程

```text
子应用水印开关
    │
    ├─ 关闭：原 formData ───────────────────────────────┐
    │                                                   │
    └─ 开启：formData.watermarkPolicy = JSON 字符串      │
                                                        ▼
拍照 / 相册 → WLPortalMedia / 既有安全桥 → 原上传接口 → 服务端
                                                        │
                                                        ├─ 保存不可变原图
                                                        ├─ 校验并解析策略
                                                        ├─ 合并登录人与服务器时间
                                                        ├─ 生成/复用幂等水印衍生图
                                                        └─ 返回正式附件 ID/URL
```

该方案不要求 mbase 新增拍照 API。`chooseImageAndUpload`、`takePhotoAndUpload` 和 `uploadPendingPhotos` 已能透传普通 `formData`；Core helper 负责把策略转换成跨钉钉原生上传也能识别的 JSON 字符串。

## 三、客户端协议

### 3.1 multipart 字段

| 字段              | 类型        | 必填   | 说明                                    |
| ----------------- | ----------- | ------ | --------------------------------------- |
| `file`            | 文件        | 是     | 保持现有上传字段名                      |
| 业务关联字段      | 字符串      | 按业务 | 如 `businessType/businessId/relativeId` |
| `watermarkPolicy` | JSON 字符串 | 否     | 不传代表完全关闭水印                    |

标准策略：

```json
{
  "enabled": true,
  "required": true,
  "templateId": "inspection-photo-v1",
  "source": "album",
  "clientCapturedAt": "2026-08-24T01:00:00.000Z",
  "location": {
    "longitude": 120.12,
    "latitude": 30.28,
    "accuracy": 15,
    "address": "现场区域"
  },
  "context": {
    "businessName": "气体检测"
  }
}
```

字段说明：

| 字段               | 约定                                                  |
| ------------------ | ----------------------------------------------------- |
| `enabled`          | 发送策略时固定为 `true`                               |
| `required`         | 默认 `true`；失败必须阻止业务提交                     |
| `templateId`       | 服务端模板 ID，1～64 位字母、数字、点、下划线、短横线 |
| `source`           | `camera`、`album` 或系统历史图使用的 `existing`       |
| `clientCapturedAt` | 客户端参考时间，不能代替服务器时间                    |
| `location`         | 客户端定位及精度，属于待校验数据                      |
| `context`          | 模板业务占位值；不得覆盖用户、公司、服务器时间        |

### 3.2 Robot_H5/Core 项目

```ts
import { buildWatermarkFormData } from '@robot-h5/core'

type ImageSource = 'camera' | 'album'

async function selectAndUpload(source: ImageSource) {
  const formData = buildWatermarkFormData(
    {
      businessType: 'inspection',
      businessId,
    },
    watermarkEnabled.value
      ? {
          enabled: true,
          required: true,
          templateId: 'inspection-photo-v1',
          source,
          clientCapturedAt: new Date(),
          location: currentLocation.value,
          context: { businessName: '气体检测' },
        }
      : { enabled: false }
  )

  return window.WLPortalMedia.chooseImageAndUpload({
    source,
    max: 1,
    url: import.meta.env.VITE_MEDIA_UPLOAD_URL,
    formData,
    header: getUploadHeaders(),
  })
}
```

`buildWatermarkFormData` 不修改原对象；策略关闭时不会增加 `watermarkPolicy`，策略开启时执行字段、时间、经纬度和上下文边界校验。

### 3.3 未使用 Core 的存量子应用

存量项目可按同一契约手工序列化，必须传字符串，不能直接把对象塞进原生 `formData`：

```ts
const formData: Record<string, unknown> = {
  businessType: 'inspection',
  businessId,
}

if (watermarkEnabled) {
  formData.watermarkPolicy = JSON.stringify({
    enabled: true,
    required: true,
    templateId: 'inspection-photo-v1',
    source,
    clientCapturedAt: new Date().toISOString(),
    context: { businessName: '气体检测' },
  })
}
```

业务必须限制模板 ID、上下文字段数量/长度和经纬度范围；新项目优先使用 Core，避免每个项目复制校验逻辑。

### 3.4 无业务 ID 延迟上传

`chooseImagePersist` 阶段只保存 `pendingId`。取得业务 ID 后，在 `uploadPendingPhotos` 的 `formData` 中加入水印策略：

```ts
const formData = buildWatermarkFormData(
  { businessType: 'inspection', businessId },
  watermarkEnabled.value
    ? {
        enabled: true,
        required: true,
        templateId: 'inspection-photo-v1',
        source: 'album',
      }
    : { enabled: false }
)

await window.WLPortalMedia.uploadPendingPhotos({
  pendingIds,
  url: import.meta.env.VITE_MEDIA_UPLOAD_URL,
  formData,
  header: getUploadHeaders(),
})
```

以真正上传时的开关状态为准；不要把水印状态伪装成文件路径或写入 `pendingId`。

## 四、服务端实现

### 4.1 接口保持向后兼容

现有接口只增加一个非必填普通表单字段：

```java
@PostMapping(
    value = "/api/files/upload",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public FileUploadResult upload(
    @RequestPart("file") MultipartFile file,
    @RequestParam("businessType") String businessType,
    @RequestParam("businessId") String businessId,
    @RequestParam(value = "watermarkPolicy", required = false) String rawPolicy
) {
    ClientWatermarkPolicy policy = watermarkPolicyParser.parseOptional(rawPolicy);
    AuthenticatedUser operator = currentUser.required();
    return imageAttachmentService.upload(
        file, businessType, businessId, policy, operator
    );
}
```

不要把 `watermarkPolicy` 声明成必填；否则未升级的子应用会全部上传失败。

### 4.2 DTO

```java
public record ClientWatermarkPolicy(
    Boolean enabled,
    Boolean required,
    String templateId,
    String source,
    Instant clientCapturedAt,
    ClientLocation location,
    Map<String, Object> context
) {}

public record ClientLocation(
    BigDecimal longitude,
    BigDecimal latitude,
    BigDecimal accuracy,
    String address
) {}
```

解析器要求：JSON 最大长度受限；拒绝未知深层对象、非法模板、越界经纬度、非有限数字及超长字符串。`enabled` 不为 `true` 时按关闭处理。

### 4.3 Service 流程

```java
public FileUploadResult upload(
    MultipartFile file,
    String businessType,
    String businessId,
    ClientWatermarkPolicy clientPolicy,
    AuthenticatedUser operator
) {
    ValidatedImage image = imageValidator.validate(file);
    StoredFile original = storage.saveOriginal(image);

    if (!watermarkPolicyService.isEnabled(clientPolicy)) {
        return attachmentService.bindOriginal(
            original, businessType, businessId
        );
    }

    TrustedWatermarkContext context = watermarkPolicyService.resolve(
        clientPolicy,
        operator,        // 用户、工号、公司来自服务端登录态
        clock.instant(), // 上传时间来自服务器时钟
        businessType,
        businessId
    );

    String fingerprint = watermarkFingerprint.of(
        original.sha256(),
        context.templateId(),
        context.templateVersion(),
        context.values()
    );

    try {
        StoredFile display = watermarkJobService.findOrCreate(
            fingerprint,
            () -> watermarkProcessor.renderAndStore(original, context)
        );
        return attachmentService.bindDerivative(original, display, context);
    } catch (Exception error) {
        if (context.required()) {
            throw new WatermarkRequiredException("水印生成失败", error);
        }
        return attachmentService.bindOriginalWithWarning(
            original, context, error
        );
    }
}
```

处理器必须具备：

1. 按文件魔数识别真实格式，拒绝伪造扩展名和损坏文件。
2. 限制文件大小、宽高、像素总数及解码耗时，防止图片解压炸弹。
3. 根据 EXIF 校正方向后再绘制；输出统一 JPEG/PNG/WebP 策略。
4. 使用应用随包部署的固定中文字体，不能依赖服务器系统字体。
5. 限制行数、字符数、透明度和位置；模板值做普通文本渲染。
6. 释放输入流、图像缓冲和临时文件，限制并发处理数。
7. 原图与水印图分开保存，数据库记录原图 ID、衍生图 ID、模板版本和状态。

原图建议先进入“暂存/未绑定”区，只有附件记录与业务数据提交成功后才转为正式对象；水印失败或数据库事务回滚时，由补偿任务清理孤立对象。小图可以同步生成并直接返回；大图或高并发场景可异步返回 `processing + taskId`，但 `required=true` 时业务提交必须等待任务最终 `success`，不能把“处理中”当作已加水印。

如果业务仅允许 JPEG/PNG，可使用经过测试的 Java 图片库；如果要支持 HEIC/WebP、高并发或超大图，建议使用隔离运行并设置资源限额的 libvips/ImageMagick 服务或对象存储图片处理能力。任何客户端字段都不得直接拼接成系统命令。

### 4.4 解析器与错误响应

解析器必须先做长度限制，再按白名单反序列化；不能让一个任意大小的 JSON 直接进入图片处理链路：

```java
public ClientWatermarkPolicy parseOptional(String rawPolicy) {
    if (!StringUtils.hasText(rawPolicy)) {
        return null; // 兼容所有未升级子应用，走旧上传逻辑
    }
    if (rawPolicy.length() > 8192) {
        throw new WatermarkPolicyInvalidException("watermarkPolicy too large");
    }
    try {
        ClientWatermarkPolicy policy = strictObjectMapper
            .readerFor(ClientWatermarkPolicy.class)
            .readValue(rawPolicy);
        return watermarkPolicyValidator.validate(policy);
    } catch (JsonProcessingException error) {
        throw new WatermarkPolicyInvalidException("invalid watermarkPolicy", error);
    }
}
```

`strictObjectMapper` 建议开启未知字段失败；校验器限制模板白名单、来源枚举、上下文字段、经纬度、精度和字符串长度。HTTP 错误响应至少返回稳定的 `code` 与 `requestId`，不要返回内部堆栈、文件路径或命令参数。

### 4.5 模板可信字段

推荐模板：

```text
业务：{businessName}
上传人：{serverUserName}（{serverUserNo}）
上传时间：{serverUploadedAt}
上传位置：{clientAddress}（精度 {clientAccuracy}m）
```

- 用户、工号、公司和上传时间只能由服务端赋值。
- 相册历史照片只能写“上传时间/上传位置”。
- EXIF 时间如需展示，标注“原图拍摄时间（仅供参考）”。
- 模板维护版本号，附件记录实际使用的版本。
- 位置和人员属于敏感信息，展示范围服从业务数据权限。

### 4.6 响应

```json
{
  "fileId": "display-file-id",
  "displayUrl": "https://files.example.com/watermarked/xxx.jpg",
  "originalFileId": "original-file-id",
  "watermarkStatus": "success",
  "watermarkTemplateId": "inspection-photo-v1",
  "watermarkTemplateVersion": "3",
  "requestId": "server-request-id"
}
```

关闭水印时可以保持旧响应；如统一返回结构，`watermarkStatus=disabled` 且 `fileId/originalFileId` 可相同。

首期建议同步处理：接口只有在水印图持久化成功后才返回 `success`，子应用无需增加任务轮询。只有在大图或并发量证明同步链路无法满足超时要求后再启用异步模式；异步接口返回 HTTP `202`、`taskId` 与 `statusUrl`，子应用轮询到 `success/failed` 后才能判定附件结果：

```json
{
  "watermarkStatus": "processing",
  "taskId": "wm-task-id",
  "statusUrl": "/api/files/watermark-tasks/wm-task-id",
  "requestId": "server-request-id"
}
```

## 五、系统内既有图片

已上传照片不应下载到客户端重新上传。新增独立衍生接口：

```http
POST /api/files/{originalFileId}/watermark-derivatives
Content-Type: application/json

{
  "enabled": true,
  "required": true,
  "templateId": "inspection-photo-v1",
  "source": "existing",
  "context": { "businessName": "气体检测" }
}
```

服务端先校验当前用户对原图和业务记录的访问权限，再从不可变原图生成水印版本。不能覆盖旧文件，也不能让调用方传任意存储路径。

## 六、幂等与失败策略

幂等指纹建议由以下内容组成：

```text
原图 SHA-256 + 模板 ID + 模板版本 + 规范化可信上下文摘要
```

- 重试命中已有成功结果时直接返回。
- 每次都从原图生成，禁止从展示图再次叠加。
- `required=true`：处理失败返回明确错误并阻止业务提交。
- `required=false`：允许返回原图，但响应必须为 `watermark_optional_fallback`，页面不能显示“已加水印”。
- 多图部分成功时，业务后端应使用请求批次号或附件幂等键去重；子应用按正式附件查询结果刷新。

推荐错误：

| code                           | 含义                   | 子应用处理              |
| ------------------------------ | ---------------------- | ----------------------- |
| `watermark_policy_invalid`     | JSON、模板或参数非法   | 修正配置，不自动重试    |
| `watermark_format_unsupported` | 图片无法解码           | 提示更换图片或转为 JPEG |
| `watermark_required_failed`    | 必须水印但生成失败     | 阻止提交并提供重试      |
| `watermark_optional_fallback`  | 可选处理失败，返回原图 | 明确提示未加水印        |

## 七、推荐上线顺序

1. 服务端先上线兼容接口：`watermarkPolicy` 非必填，功能开关默认关闭。
2. 用未升级的存量子应用回归拍照、相册、无 ID 延迟上传，确认请求和响应与现网一致。
3. 服务端配置模板、字体、存储、幂等与监控，在测试环境直接用 multipart 请求验证。
4. 发布包含 `buildWatermarkFormData` 的 Core 版本，模板及子应用升级依赖。
5. 子应用先只对测试账号展示开关，验证各宿主后再按业务逐步放量。
6. 观察失败率、处理耗时、孤立原图清理和存储增量；出现异常只关闭水印开关，无需回退原上传能力。

## 八、验证矩阵

| 场景                  | 验收要点                                               |
| --------------------- | ------------------------------------------------------ |
| 水印关闭              | 不发送 `watermarkPolicy`；请求、响应、文件与旧链路一致 |
| 钉钉 Android/iOS 拍照 | 原生直传正常；服务端返回带水印图                       |
| 钉钉 Android/iOS 相册 | 历史照片可加水印；文字标注“上传”而非伪造“拍摄”         |
| App/PDA               | 拍照、相册、取消、权限拒绝和大图均有明确结果           |
| 普通 H5/微信 WebView  | multipart JSON 字段和跨域上传正常                      |
| 无业务 ID             | `pendingId` 取得 ID 后上传时才应用水印策略             |
| 系统既有图片          | 生成衍生图且原图不变；无权用户被拒绝                   |
| 格式与方向            | JPEG/PNG、横竖图、EXIF 旋转、损坏文件符合策略          |
| 幂等                  | 重试只产生一个衍生图，不出现双重水印                   |
| 强制失败              | `required=true` 失败时阻止业务提交，关闭水印不受影响   |

日志记录 requestId、原图 ID、衍生图 ID、模板版本、耗时和状态；不得输出 Token、图片二进制或完整敏感水印文字。
