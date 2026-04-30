import type { DefaultTheme } from "vitepress";

/**
 * 搜索配置
 * @description 本地搜索配置，支持中文搜索
 */
export const search: DefaultTheme.Config["search"] = {
  provider: "local",
  options: {
    // 中文分词：按字切割，提升中文搜索命中率
    _tokenize: (text: string, locale?: string) =>
      locale === "root" ? [...text] : text.split(/\s+/),
    locales: {
      root: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  },
};
