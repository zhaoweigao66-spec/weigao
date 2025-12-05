<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Todo List</h1>
        <p class="text-gray-600">管理你的任务，提高工作效率</p>
      </div>



    <!-- 添加新任务 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="flex gap-2">
          <input
            v-model="newTodoTitle"
            type="text"
            placeholder="添加新任务..."
            class="input input-bordered flex-1"
            @keyup.enter="addTodo"
          />
          <select v-model="newTodoPriority" class="select select-bordered">
            <option value="low">低优先级</option>
            <option value="medium">中优先级</option>
            <option value="high">高优先级</option>
          </select>
          <button @click="addTodo" class="btn btn-primary">
            添加
          </button>
        </div>
      </div>
    </div>

    <!-- 过滤器和统计 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="flex flex-wrap gap-2 justify-between items-center">
          <div class="flex gap-2">
            <button
              v-for="filter in filters"
              :key="filter.value"
              @click="currentFilter = filter.value"
              class="btn"
              :class="currentFilter === filter.value ? 'btn-primary' : 'btn-outline'"
            >
              {{ filter.label }}
            </button>
          </div>
          <div class="text-sm">
            <span class="badge badge-success mr-2">已完成: {{ completedCount }}</span>
            <span class="badge badge-warning">待完成: {{ pendingCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="space-y-2">
      <div
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="card bg-base-100 shadow-lg"
      >
        <div class="card-body p-4">
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              v-model="todo.completed"
              class="checkbox checkbox-primary"
            />
            <div class="flex-1">
              <h3
                class="text-lg font-semibold"
                :class="{ 'line-through text-gray-500': todo.completed }"
              >
                {{ todo.title }}
              </h3>
              <div class="flex gap-2 mt-1">
                <span
                  class="badge"
                  :class="{
                    'badge-success': todo.priority === 'low',
                    'badge-warning': todo.priority === 'medium',
                    'badge-error': todo.priority === 'high'
                  }"
                >
                  {{ priorityLabels[todo.priority] }}
                </span>
                <span class="badge badge-outline text-xs">
                  {{ formatDate(todo.createdAt) }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                v-if="!todo.editing"
                @click="startEdit(todo)"
                class="btn btn-ghost btn-sm"
              >
                编辑
              </button>
              <button
                v-if="todo.editing"
                @click="saveEdit(todo)"
                class="btn btn-success btn-sm"
              >
                保存
              </button>
              <button
                v-if="todo.editing"
                @click="cancelEdit(todo)"
                class="btn btn-ghost btn-sm"
              >
                取消
              </button>
              <button
                @click="deleteTodo(todo.id)"
                class="btn btn-ghost btn-sm text-error"
              >
                删除
              </button>
            </div>
          </div>
          <div v-if="todo.editing" class="mt-3">
            <input
              v-model="todo.editTitle"
              type="text"
              class="input input-bordered w-full"
              @keyup.enter="saveEdit(todo)"
              @keyup.esc="cancelEdit(todo)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredTodos.length === 0" class="text-center py-12">
      <p class="text-gray-500">{{ emptyMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'

export default {
  name: 'TodoList',
  setup() {
    const todos = ref([])
    const newTodoTitle = ref('')
    const newTodoPriority = ref('medium')
    const currentFilter = ref('all')

    const filters = [
      { label: '全部', value: 'all' },
      { label: '待完成', value: 'pending' },
      { label: '已完成', value: 'completed' },
      { label: '高优先级', value: 'high' }
    ]

    const priorityLabels = {
      low: '低优先级',
      medium: '中优先级',
      high: '高优先级'
    }

    // 从本地存储加载
    const loadTodos = () => {
      const stored = localStorage.getItem('todos')
      if (stored) {
        todos.value = JSON.parse(stored)
      }
    }

    // 保存到本地存储
    const saveTodos = () => {
      localStorage.setItem('todos', JSON.stringify(todos.value))
    }

    // 添加新任务
    const addTodo = () => {
      if (newTodoTitle.value.trim()) {
        const newTodo = {
          id: Date.now(),
          title: newTodoTitle.value.trim(),
          completed: false,
          priority: newTodoPriority.value,
          createdAt: new Date().toISOString(),
          editing: false,
          editTitle: ''
        }
        todos.value.unshift(newTodo)
        newTodoTitle.value = ''
        newTodoPriority.value = 'medium'
        saveTodos()
      }
    }

    // 删除任务
    const deleteTodo = (id) => {
      todos.value = todos.value.filter(todo => todo.id !== id)
      saveTodos()
    }

    // 开始编辑
    const startEdit = (todo) => {
      todo.editTitle = todo.title
      todo.editing = true
    }

    // 保存编辑
    const saveEdit = (todo) => {
      if (todo.editTitle.trim()) {
        todo.title = todo.editTitle.trim()
        todo.editing = false
        saveTodos()
      }
    }

    // 取消编辑
    const cancelEdit = (todo) => {
      todo.editing = false
      todo.editTitle = ''
    }

    // 过滤任务
    const filteredTodos = computed(() => {
      switch (currentFilter.value) {
        case 'pending':
          return todos.value.filter(todo => !todo.completed)
        case 'completed':
          return todos.value.filter(todo => todo.completed)
        case 'high':
          return todos.value.filter(todo => todo.priority === 'high')
        default:
          return todos.value
      }
    })

    // 统计
    const completedCount = computed(() =>
      todos.value.filter(todo => todo.completed).length
    )

    const pendingCount = computed(() =>
      todos.value.filter(todo => !todo.completed).length
    )

    // 空状态消息
    const emptyMessage = computed(() => {
      switch (currentFilter.value) {
        case 'pending':
          return '没有待完成的任务'
        case 'completed':
          return '没有已完成的任务'
        case 'high':
          return '没有高优先级任务'
        default:
          return '还没有任务，添加一个吧！'
      }
    })

    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 监听变化自动保存
    watch(todos, saveTodos, { deep: true })

    onMounted(loadTodos)

    return {
      todos,
      newTodoTitle,
      newTodoPriority,
      currentFilter,
      filters,
      priorityLabels,
      addTodo,
      deleteTodo,
      startEdit,
      saveEdit,
      cancelEdit,
      filteredTodos,
      completedCount,
      pendingCount,
      emptyMessage,
      formatDate
    }
  }
}
</script>

<style scoped>
.checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}
</style>