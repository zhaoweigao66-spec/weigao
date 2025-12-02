<script lang="js" setup>
import { getDiameterRanges } from './utils'

defineOptions({ name: '' })
/**原始数据 */
let originData = null

let newData = null

const basicParams = {
  label: 7.5,//径阶
  min: 5,
  max: 9.9,
  spacing: 5,
}

const handleData = () => {
  const {label,min,max,spacing} = basicParams;
  const diameterRanges = getDiameterRanges(min,max,label,spacing);
  const res = calculateDiameterRange(csvData, diameterRanges, area);//result为径阶整化结果
}

const importCsv = async () => {

}
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="h-16 w-full flex items-center justify-between p-4 bg-base-300">
      <button class="btn btn-ghost" @click="importCsv">导入 CSV</button>
      <div class="flex flex-row gap-4">
        <button
          class="btn"
          popovertarget="popover-2"
          style="anchor-name: --anchor-2"
        >
          切换主题
        </button>
        <ul
          class="dropdown menu w-32 rounded-box bg-base-100 shadow-sm"
          popover
          id="popover-2"
          style="position-anchor: --anchor-2"
        >
          <li>
            <input
              type="radio"
              name="theme-buttons"
              class="btn theme-controller join-item"
              aria-label="Default"
              value="default"
            />
          </li>

          <li>
            <input
              type="radio"
              name="theme-buttons"
              class="btn theme-controller join-item"
              aria-label="Retro"
              value="retro"
            />
          </li>
          <li>
            <input
              type="radio"
              name="theme-buttons"
              class="btn theme-controller join-item"
              aria-label="dark"
              value="dark"
            />
          </li>
          <li>
            <input
              type="radio"
              name="theme-buttons"
              class="btn theme-controller join-item"
              aria-label="fantasy"
              value="fantasy"
            />
          </li>
          <li>
            <input
              type="radio"
              name="theme-buttons"
              class="btn theme-controller join-item"
              aria-label="luxury"
              value="luxury"
            />
          </li>
        </ul>
        <button
          class="btn"
          popovertarget="popover-1"
          style="anchor-name: --anchor-1"
        >
          更多操作
        </button>
        <ul
          class="dropdown menu w-32 rounded-box bg-base-100 shadow-sm"
          popover
          id="popover-1"
          style="position-anchor: --anchor-1"
        >
          <li><a>导出 CSV</a></li>
          <li><a onclick="param_modal.showModal()">修改参数</a></li>
        </ul>
      </div>
    </div>
    <div
      class="p-4 my-6 h-16 bg-base-200 flex items-center justify-start gap-4"
    >
      <input type="number" class="input" placeholder="在此输入面积" />
      <input type="number" class="input" placeholder="在此输入坡度" />
      <label class="input">
        <input type="text" placeholder="在此输入降水数据" />
        <span class="label">map</span>
      </label>
      <label class="input">
        <input type="text" placeholder="在此输入温度数据" />
        <span class="label">mat</span>
      </label>
      <button class="btn btn-ghost">预测 5 年</button>
      <button class="btn btn-ghost">砍伐</button>
    </div>
    <div class="bg-base-200 flex-1"></div>
    <dialog id="param_modal" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <h3 class="text-lg font-bold">参数修改</h3>
        <p class="py-4">Press ESC key or click on ✕ button to close</p>
      </div>
    </dialog>
  </div>
</template>
