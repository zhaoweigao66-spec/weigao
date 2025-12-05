<template>
  <div class="container mx-auto p-4">
    <!-- 原有的 App.vue 内容 -->
    <div class="flex flex-col lg:flex-row gap-4 mb-6">
      <!-- 左侧文件上传区域 -->
      <div class="flex-1">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-2xl font-bold mb-4">文件上传</h2>

            <!-- 文件拖拽上传区域 -->
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
              :class="{ 'border-primary bg-primary/5': isDragging }"
            >
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept=".csv"
                @change="handleFileSelect"
              />
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-lg mb-2">拖拽 CSV 文件到此处</p>
              <p class="text-sm text-gray-500 mb-4">或者</p>
              <button
                class="btn btn-primary"
                @click="$refs.fileInput.click()"
              >
                选择文件
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧功能选项 -->
      <div class="flex-1">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-2xl font-bold mb-4">功能选项</h2>

            <!-- 汇总方式选择 -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-2">汇总方式</label>
              <select class="select select-bordered w-full">
                <option>按日汇总</option>
                <option>按周汇总</option>
                <option>按月汇总</option>
              </select>
            </div>

            <!-- 数据处理选项 -->
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">去除异常值</span>
                <input type="checkbox" class="checkbox" />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">数据平滑处理</span>
                <input type="checkbox" class="checkbox" />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">生成统计报告</span>
                <input type="checkbox" class="checkbox" />
              </label>
            </div>

            <!-- 操作按钮 -->
            <div class="card-actions justify-end mt-6">
              <button class="btn btn-outline">重置</button>
              <button class="btn btn-primary" disabled>开始处理</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据展示区域 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="tabs tabs-boxed mb-4">
          <a class="tab tab-active">数据表格</a>
          <a class="tab">图表展示</a>
          <a class="tab">统计报告</a>
        </div>

        <!-- 数据表格占位符 -->
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>日期</th>
                <th>数值</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-01-01</td>
                <td>125.5</td>
                <td><div class="badge badge-success">正常</div></td>
                <td>
                  <button class="btn btn-ghost btn-xs">编辑</button>
                  <button class="btn btn-ghost btn-xs">删除</button>
                </td>
              </tr>
              <tr>
                <td>2024-01-02</td>
                <td>98.3</td>
                <td><div class="badge badge-success">正常</div></td>
                <td>
                  <button class="btn btn-ghost btn-xs">编辑</button>
                  <button class="btn btn-ghost btn-xs">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Papa from 'papaparse'

export default {
  name: 'Home',
  setup() {
    const isDragging = ref(false)
    const fileInput = ref(null)

    const handleDragOver = (e) => {
      e.preventDefault()
      isDragging.value = true
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      isDragging.value = false
    }

    const handleDrop = (e) => {
      e.preventDefault()
      isDragging.value = false

      const files = e.dataTransfer.files
      if (files.length > 0 && files[0].type === 'text/csv') {
        processCSV(files[0])
      }
    }

    const handleFileSelect = (e) => {
      const files = e.target.files
      if (files.length > 0) {
        processCSV(files[0])
      }
    }

    const processCSV = (file) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log('CSV 文件解析完成:', results.data)
          // 这里可以添加处理 CSV 数据的逻辑
        },
        error: (error) => {
          console.error('CSV 解析错误:', error)
        }
      })
    }

    return {
      isDragging,
      fileInput,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleFileSelect
    }
  }
}
</script>