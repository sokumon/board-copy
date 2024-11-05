import TiptapTableHeader from "@tiptap/extension-table-header"
import { Plugin } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import { getCellsInRow, isColumnSelected, selectColumn } from "./utils"

export type TableHeaderOptions = {
  HTMLAttributes: Record<string, any>
}
export const TableHeader = TiptapTableHeader.extend<TableHeaderOptions>({
  addAttributes() {
    return {
      HTMLAttributes: {},
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth")
          const value = colwidth
            ? colwidth.split(",").map((item) => parseInt(item, 10))
            : null

          return value
        },
      },
      style: {
        default: null,
      },
    }
  },

  addProseMirrorPlugins() {
    const { isEditable } = this.editor

    return [
      new Plugin({
        props: {
          decorations: (state) => {
            if (!isEditable) {
              return DecorationSet.empty
            }

            const { doc, selection } = state
            const decorations: Decoration[] = []
            const cells = getCellsInRow(0)(selection)
            if (cells) {
              cells.forEach(({ pos }: { pos: number }, index: number) => {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const colSelected = isColumnSelected(index)(selection)
                    let className =
                      "grip-column align-middle absolute left-1/2  bg-white border rounded-sm w-4 h-4 -top-5  cursor-pointer z-10"

                    if (colSelected) {
                      className += " selected"
                    }
                    if (index === 0) {
                      className += " first"
                    }

                    if (index === cells.length - 1) {
                      className += " last"
                    }

                    const grip = document.createElement("Button")
                    grip.className = className

                    grip.addEventListener("mousedown", (event) => {
                      event.preventDefault()
                      event.stopImmediatePropagation()

                      this.editor.view.dispatch(
                        selectColumn(index)(this.editor.state.tr)
                      )
                    })

                    return grip
                  })
                )
              })
            }

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})

export default TableHeader
