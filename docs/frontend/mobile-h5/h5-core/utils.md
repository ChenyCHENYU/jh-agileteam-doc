# 工具函数库

零依赖工具函数，不依赖 Vue / Bridge / Config，可独立使用。

```ts
// 按需引入
import { compressImage, fileToBase64 } from '@robot-h5/core/utils/image';
import { formatDate, formatMoney } from '@robot-h5/core/utils/format';

// 或从主入口全量引入
import { compressImage, formatDate, isPhone, getDeviceInfo } from '@robot-h5/core';
```

---

## image — 图片处理

### compressImage

图片压缩，支持限制文件大小、分辨率、输出格式。

```ts
import { compressImage } from '@robot-h5/core/utils/image';

const compressed = await compressImage(originalFile, {
  maxSize: 1024,           // 最大 1MB
  quality: 0.8,            // 质量 80%
  maxWidth: 1920,          // 最大宽度
  maxHeight: 1080,         // 最大高度
  outputType: 'image/jpeg',
});
```

**CompressOptions**

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `maxSize` | `number` | — | 最大文件大小（KB） |
| `quality` | `number` | `0.8` | 压缩质量 0-1 |
| `maxWidth` | `number` | — | 最大宽度（px） |
| `maxHeight` | `number` | — | 最大高度（px） |
| `outputType` | `'image/jpeg' \| 'image/png' \| 'image/webp'` | 原图格式 | 输出格式 |

### fileToBase64

```ts
const base64 = await fileToBase64(file);
// → 'data:image/jpeg;base64,/9j/4AAQ...'
```

### base64ToBlob

```ts
const blob = base64ToBlob(base64String);
```

---

## coord — 坐标系转换

中国地图使用 GCJ-02（火星坐标），GPS 原始数据使用 WGS-84，两者存在偏移，需转换。

```ts
import { gcj02ToWgs84, wgs84ToGcj02 } from '@robot-h5/core/utils/coord';

// 高德/腾讯坐标 → GPS 坐标
const [lng, lat] = gcj02ToWgs84(120.153576, 30.287459);

// GPS 坐标 → 高德/腾讯坐标
const [lng, lat] = wgs84ToGcj02(120.152345, 30.286789);
```

| 坐标系 | 使用场景 |
|---|---|
| GCJ-02 | 高德地图、腾讯地图、钉钉定位 |
| WGS-84 | GPS 原始数据、Google Maps（海外） |

---

## device — 设备信息

```ts
import { isAndroid, isIOS, getDeviceInfo } from '@robot-h5/core/utils/device';

if (isAndroid()) {
  // Android 特殊处理
}

if (isIOS()) {
  // iOS 特殊处理
}

const info = getDeviceInfo();
// {
//   os: 'ios',
//   osVersion: '17.4',
//   screenWidth: 390,
//   screenHeight: 844,
//   pixelRatio: 3,
//   userAgent: 'Mozilla/5.0 ...'
// }
```

**DeviceInfo**

| 属性 | 类型 | 说明 |
|---|---|---|
| `os` | `'android' \| 'ios' \| 'unknown'` | 操作系统 |
| `osVersion` | `string` | 系统版本 |
| `screenWidth` | `number` | 屏幕宽度 |
| `screenHeight` | `number` | 屏幕高度 |
| `pixelRatio` | `number` | 设备像素比 |
| `userAgent` | `string` | UA 字符串 |

---

## file — 文件操作

```ts
import { getFileType, formatFileSize } from '@robot-h5/core/utils/file';

getFileType('report.pdf');     // → 'application/pdf'
getFileType('photo.jpg');      // → 'image/jpeg'
getFileType('data.xlsx');      // → 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

formatFileSize(1536);          // → '1.5 KB'
formatFileSize(2621440);       // → '2.5 MB'
formatFileSize(1073741824);    // → '1 GB'
```

---

## validate — 数据验证

针对中国大陆常用数据格式的验证函数。

```ts
import { isPhone, isIdCard, isEmail, isCreditCode } from '@robot-h5/core/utils/validate';

isPhone('13800138000');                        // → true
isPhone('1234567');                             // → false

isIdCard('110101199003074518');                 // → true（18 位身份证）

isEmail('user@example.com');                   // → true

isCreditCode('91310000MA1FL8KQ30');            // → true（统一社会信用代码）
```

| 函数 | 规则 |
|---|---|
| `isPhone` | 中国大陆手机号（`1[3-9]\d{9}`） |
| `isIdCard` | 18 位身份证号（含校验码验证） |
| `isEmail` | 标准邮箱格式 |
| `isCreditCode` | 18 位统一社会信用代码 |

---

## format — 格式化

```ts
import { formatDate, formatMoney } from '@robot-h5/core/utils/format';

// 日期格式化
formatDate(new Date(), 'YYYY-MM-DD');           // → '2024-03-20'
formatDate(1710921600000, 'YYYY-MM-DD HH:mm');  // → '2024-03-20 14:00'
formatDate('2024-03-20', 'MM月DD日');            // → '03月20日'

// 金额千分位
formatMoney(1234567.89);     // → '1,234,567.89'
formatMoney(1234567.89, 0);  // → '1,234,568'
formatMoney(99.1, 2);        // → '99.10'
```

| 函数 | 参数 | 说明 |
|---|---|---|
| `formatDate` | `(date, pattern?)` | 支持 Date / 时间戳 / 字符串，模式：`YYYY MM DD HH mm ss` |
| `formatMoney` | `(amount, decimals?)` | 千分位格式化，`decimals` 默认 2 |
