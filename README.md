# github-style

## Customized points by suihan74

[Hugoテーマのカスタマイズ箇所メモ - すいはんぶろぐ.io](https://suihan74.github.io/posts/2019/12_26_00_theme_customize/)

---

## Requirements

- [Hugo v0.68.0 or higher](https://github.com/gohugoio/hugo/releases)  
  to use minify configuration

## Install the theme

```bash
mkdir themes
git submodule add git@github.com:MeiK2333/github-style.git themes/github-style
```

## Update the theme

```bash
cd themes/github-style
git pull
```

## Setup About page

```bash
hugo new about.md
```

add `layout = "about"` to `content/about.md`

```md
---
title: "About"
date: 2019-10-22T18:46:47+08:00
layout: "about"
---

about me
```

## config.toml example

```toml
baseURL = "https://example.com/"
title = "GitHub Style"
googleAnalytics = "UA-123-456-789"
theme = "github-style"
copyright = "© 2019. Theme by <a href=\"https://github.com/MeiK2333/github-style\"><span>github-style</span></a>"

[params]
  author = "example"
  description = "example"
  github = "example"
  facebook = "example"
  twitter = "example"
  misskey = "user profile url"
  mastodon = "user profile url"
  email = "example@domain.com"
  utterances = "example/example.github.io"
  avatar = "https://example.com/images/avatar.png"
  url = "https://example.com"
  keywords = "blog, google analytics"

# this section is needed to escape minifying inline SVG!!
[minify]
  disableSVG = true
```

## Assets

- [Octicons](https://primer.style/octicons/) ([primer/octicons - GitHub](https://github.com/primer/octicons))
