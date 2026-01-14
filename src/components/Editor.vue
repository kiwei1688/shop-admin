<template>
  <editor v-model="content" tag-name="div" :init="init"/>
</template>

<script setup>
import tinymce from "tinymce/tinymce"
import Editor from "@tinymce/tinymce-vue"
import {ref, watch} from "vue"
import "tinymce/themes/silver/theme" // 引用主題文建
import "tinymce/icons/default" // 引用圖標文件
import "tinymce/models/dom"

import "tinymce/plugins/advlist"
import "tinymce/plugins/anchor"
import "tinymce/plugins/autolink"
import "tinymce/plugins/autoresize"
import "tinymce/plugins/autosave"
import "tinymce/plugins/charmap" // 特殊字符
import "tinymce/plugins/code" // 查看源碼
import "tinymce/plugins/codesample" // 插入代碼
import "tinymce/plugins/directionality"
import "tinymce/plugins/emoticons"
import "tinymce/plugins/fullscreen" // 全屏
import "tinymce/plugins/help"
import "tinymce/plugins/image" // 插入上傳圖片插件
import "tinymce/plugins/importcss" // 圖片工具
import "tinymce/plugins/insertdatetime" // 時間插入
import "tinymce/plugins/link"
import "tinymce/plugins/lists" // 列表插件
import "tinymce/plugins/media" // 插入是屏插件
</script>