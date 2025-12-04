<script lang="js" setup>
import { getDiameterRanges } from './utils'
import { useToast } from './components/useToast'
import Papa from 'papaparse'
import { ref } from 'vue'

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

const bdqParams = ref({
  B: null,
  D: null,
  Q: null
})

const place = ref('')



const handleData = () => {
  const { label, min, max, spacing } = basicParams;
  const diameterRanges = getDiameterRanges(min, max, label, spacing);
  newData = calculateDiameterRange(originData, diameterRanges, area);//result为径阶整化结果
}

const fileLoad = async (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'text/csv') {
    const reader = new FileReader();

    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      const decoder = new TextDecoder('utf-8');
      const csvContent = decoder.decode(arrayBuffer);

      Papa.parse(csvContent, {
        complete: function (result) {
          useToast().success("文件解析成功!");
          originData = result.data;
          console.log("数据内容:", originData);
        },
        error: function (error) {
          useToast().error("文件解析失败!");
          console.error("解析错误:", error);
        }
      });
    };

    // 读取文件为 ArrayBuffer
    reader.readAsArrayBuffer(file);
  } else {
    useToast().warning("请选择一个有效的 CSV 文件!");
  }
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="toast toast-center toast-top" id="toast-root"></div>
    <div class="h-16 w-full flex items-center justify-between p-4 bg-base-300">
      <input type="file" class="file-input file-input-ghost" id="fileInput" accept=".csv" @change="fileLoad" />
      <div class="flex flex-row gap-4">
        <button class="btn btn-ghost" popovertarget="popover-2" style="anchor-name: --anchor-2">
          切换主题
        </button>
        <ul class="dropdown menu w-32 rounded-box bg-base-100 shadow-sm" popover id="popover-2"
          style="position-anchor: --anchor-2">
          <li>
            <input type="radio" name="theme-buttons" class="btn theme-controller join-item" aria-label="Default"
              value="default" />
          </li>

          <li>
            <input type="radio" name="theme-buttons" class="btn theme-controller join-item" aria-label="Retro"
              value="retro" />
          </li>
          <li>
            <input type="radio" name="theme-buttons" class="btn theme-controller join-item" aria-label="dark"
              value="dark" />
          </li>
          <li>
            <input type="radio" name="theme-buttons" class="btn theme-controller join-item" aria-label="fantasy"
              value="fantasy" />
          </li>
          <li>
            <input type="radio" name="theme-buttons" class="btn theme-controller join-item" aria-label="luxury"
              value="luxury" />
          </li>
        </ul>
        <button class="btn btn-ghost" popovertarget="popover-1" style="anchor-name: --anchor-1">
          更多操作
        </button>
        <ul class="dropdown menu w-32 rounded-box bg-base-100 shadow-sm" popover id="popover-1"
          style="position-anchor: --anchor-1">
          <li><a>导出 CSV</a></li>
          <li><a onclick="param_modal.showModal()">修改参数</a></li>
        </ul>
      </div>
    </div>
    <div class="p-4 h-16 bg-base-100 flex items-center justify-start gap-4">
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
      <button class="btn btn-ghost">清除</button>
    </div>
    <div class="bg-base-100 px-4">
      <div class="card w-full bg-base-100 card-xs shadow-sm">
        <div class="card-body">
          <div class="h-12 flex items-center justify-start gap-4">
            <div class="text-sm font-bold">当前参数：</div>
            <div class="flex gap-2">
              <kbd class="kbd kbd-md">B: {{ bdqParams.B }}</kbd>
              <kbd class="kbd kbd-md">D: {{ bdqParams.D }}</kbd>
              <kbd class="kbd kbd-md">Q: {{ bdqParams.Q }}</kbd>
              <kbd class="kbd kbd-md">地区: {{ place }}</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-base-100 px-4 flex-1 my-4">
      <div class="card w-full bg-base-100 card-xs shadow-sm h-full">
        <div class="card-body">
        </div>
      </div>
    </div>
    <dialog id="param_modal" class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 class="text-lg font-bold">参数修改</h3>
        <div class="flex flex-row gap-4">
          <input type="number" class="input" placeholder="B" />
          <input type="number" class="input" placeholder="D" />
          <input type="number" class="input" placeholder="Q" />
        </div>
      </div>
    </dialog>
  </div>
</template>
