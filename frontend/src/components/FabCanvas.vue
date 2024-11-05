<template>
  <div class="flex w-full">
    <canvas
      ref="canvas"
      id="hello"
      :width="canvas_width"
      :height="canvas_height"
      class="flex-col w-full"
    ></canvas>
    <Transition
      enter-from-class="translate-x-[150%]"
      leave-to-class="translate-x-[150%]"
      enter-active-class="transition duration-150"
      leave-active-class="transition duration-150"
    >
      <div
        v-if="showSidebar"
        class="min-w-[352px] max-w-[352px] min-h-full max-h-full border-l z-10 p-6 opacity-100 bg-white"
      >
        <div
          v-if="tab === 1"
          class="flex h-full w-full flex-col rounded-lg text-center opacity-100"
        >
          <span class="font-medium text-gray-600 text-xs my-2"
            >Drawing Tools</span
          >
          <div class="w-full flex justify-between gap-x-2 mb-6">
            <Button class="w-1/3 font-medium" @click="clickHandler('Pencil')">
              Pencil
            </Button>
            <Button class="w-1/4 font-medium" @click="clickHandler('Spray')">
              Spray
            </Button>
            <Button class="w-1/4 font-medium" @click="clickHandler('WColor')">
              Watercolor
            </Button>
          </div>
          <span class="font-medium text-gray-600 text-xs my-2"
            >Set Color
            <span v-if="activeTool"> for {{ activeTool }}</span></span
          >
          <ColorInput
            class="mt-0.5 mb-1"
            @change="(value) => changeColorBrush(value)"
          />
          <span class="font-medium text-gray-600 text-xs my-2"
            >Brush Width</span
          >
          <input
            class="pr-6 accent-green-500"
            type="range"
            :value="brushWidth"
            min="0"
            max="100"
            @input="(event) => changeBrushWidth(event.target.value)"
          />
          <span class="font-medium text-gray-600 text-xs my-2"
            >Eraser Settings</span
          >
          <input
            class="pr-6 accent-green-500"
            type="range"
            :value="eraserWidth"
            min="0"
            max="100"
            @input="(event) => changeEraserWidth(event.target.value)"
          />
          <!-- onmousemove="rangeSlide(this.value)"> -->
        </div>
      </div>
    </Transition>
    <div
      class="sm:flex flex-col items-center overflow-hidden h-full min-w-[48px] gap-1 pt-3 px-0 border-l z-0 bg-white"
    >
      <Button
        class="text-gray-600"
        :class="['text-black bg-whitete-200']"
        variant="minimal"
        @click="switchTab(1)"
      >
        <Pen />
      </Button>
      <Button
        class="text-gray-600"
        :class="['text-black bg-white-200']"
        variant="minimal"
        @click="switchTab(2)"
      >
        <Shapes />
      </Button>
      <Button
        class="text-gray-600"
        :class="['text-black bg-white-200']"
        variant="minimal"
        @click="switchTab(1)"
      >
        <CanvasMove />
      </Button>
      <Button
        class="text-gray-600"
        :class="['text-black bg-white-200']"
        variant="minimal"
        @click="switchTab(1)"
      >
        <Text />
      </Button>
      <Button
        class="text-gray-600"
        :class="['text-black bg-white-200']"
        variant="minimal"
        @click="switchTab(1)"
      >
        <CanvasMove />
      </Button>
      <Button
        class="text-gray-600"
        :class="['text-black bg-white-200']"
        variant="minimal"
        @click="clickHandler('Erase')"
      >
        <Eraser />
      </Button>
      <Button
        class="text-gray-600"
        :class="['text-black bg-white-200']"
        variant="minimal"
        @click="clickHandler('Clear')"
      >
        <Delete />
      </Button>
    </div>
  </div>
</template>

<script>
import Info from "./EspressoIcons/Info.vue"
import Comment from "./EspressoIcons/Comment.vue"
import Pallete from "./BoardIcons/Pallete.vue"
import Shapes from "./BoardIcons/Shapes.vue"
import Text from "./BoardIcons/Text.vue"
import CanvasMove from "./BoardIcons/CanvasMove.vue"
import Eraser from "./BoardIcons/Eraser.vue"
import Delete from "./BoardIcons/Delete.vue"
import Pen from "./BoardIcons/Pen.vue"
import { Button } from "frappe-ui"
import ColorInput from "./DocEditor/ColorInput.vue"
export default {
  name: "FabCanvas",
  components: {
    Info,
    Comment,
    Pallete,
    Shapes,
    Text,
    CanvasMove,
    Eraser,
    Delete,
    Button,
    Pen,
    ColorInput,
  },
  data() {
    return {
      activeTool: null,
      brushWidth: 30,
      canvas_width: document.documentElement.clientWidth - 100,
      canvas_height: document.documentElement.clientHeight,
      showSidebar: false,
      tab: null,
      eraserWidth: 10,
    }
  },
  mounted() {
    this.canvas = new this.fabric.Canvas("hello")
    if (localStorage.getItem("canvasState")) {
      let canvas_json = localStorage.getItem("canvasState")
      this.canvas.loadFromJSON(canvas_json)
    }

    // Adjust canvas size to match the window size
    // Add a rectangle
  },
  methods: {
    changeColorBrush(value) {
      this.canvas.freeDrawingBrush.color = value
    },
    changeBrushWidth(value) {
      this.brushWidth = value
      this.canvas.freeDrawingBrush.width = this.brushWidth
    },
    changeEraserWidth(value) {
      console.log(value)
      this.eraserWidth = value
      console.log(this.activeTool)
      if (this.activeTool === "Erase") {
        this.canvas.freeDrawingBrush.width = this.eraserWidth
      }
    },
    toggleSideBar() {
      if (this.showSidebar) {
        this.showSidebar = false
      } else {
        this.showSidebar = true
      }
    },
    switchTab(value) {
      this.toggleSideBar()
      this.tab = value
    },
    clickHandler(value) {
      this.activeTool = value
      // let allowed = ["Pencil","WColor","Spray"]
      // if(value in allowed){

      // }
      this.canvas.on("mouse:up", this.save_draw())
      if (value === "WColor") {
        this.canvas.freeDrawingBrush = new fabric.CircleBrush(this.canvas)
        this.canvas.freeDrawingBrush.width = parseInt(this.brushWidth)
        console.log(this.canvas.freeDrawingBrush.width)
        this.canvas.isDrawingMode = true
      }
      if (value === "Pencil") {
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
        console.log(parseInt(this.brushWidth))
        this.canvas.freeDrawingBrush.width = parseInt(this.brushWidth)
        this.canvas.isDrawingMode = true
      }
      if (value === "Erase") {
        this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas)
        this.canvas.freeDrawingBrush.width = this.eraserWidth
        this.canvas.isDrawingMode = true
      }

      if (value === "Spray") {
        this.canvas.freeDrawingBrush = new fabric.SprayBrush(this.canvas)
        this.canvas.freeDrawingBrush.width = parseInt(this.brushWidth)
        this.canvas.isDrawingMode = true
      }

      if (value === "Rect") {
        this.canvas.isDrawingMode = false
        const rect = new fabric.Rect({
          left: 0,
          top: 100,
          fill: "red",
          width: 200,
          height: 200,
          erasable: false,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          evented: true,
        })
        console.log(rect)
        this.canvas.add(rect)
      }

      if (value === "Move") {
        this.canvas.isDrawingMode = false
        let all_objects = this.canvas.getObjects()
        if (all_objects.length > 0) {
          for (let i = 0; i < all_objects.length; i++) {
            all_objects[i].selectable = true
            all_objects[i].hasControls = true
            all_objects[i].hasBorders = true
          }
        }
      }

      if (value === "Triangle") {
        this.canvas.isDrawingMode = false
        var triangle = new fabric.Triangle({
          width: 150,
          height: 100,
          fill: "",
          stroke: "green",
          strokeWidth: 3,
          cornerColor: "blue",
          angle: 45,
          erasable: false,
          selectable: false,
          hasControls: false,
          hasBorders: false,
          evented: true,
        })

        // Render the triangle in canvas
        this.canvas.add(triangle)
        this.canvas.centerObject(triangle)
      }

      if (value === "Circle") {
        this.canvas.isDrawingMode = false
        var circle = new fabric.Circle({
          left: 300,
          top: 300,
          fill: "yellow",
          radius: 50,
        })
        this.canvas.add(circle)
      }

      if (value === "Text") {
        this.canvas.isDrawingMode = false
        var textEditable = new fabric.Textbox("Edit me", {
          left: 70,
          width: 500,
          editable: true,
        })

        this.canvas.add(textEditable)
      }

      if (value === "Clear") {
        this.canvas.clear()
        localStorage.setItem("canvasState", "")
      }
      this.save_draw()
    },
    save_draw() {
      let canvas_json = this.canvas.toJSON()
      console.log()
      if (canvas_json.objects.length > 0) {
        localStorage.setItem("canvasState", JSON.stringify(canvas_json))
      }
    },
  },
}
</script>
