/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};define(["require","exports","jquery","lit-element","TYPO3/CMS/Core/lit-helper","../Modal","../Severity"],(function(e,t,s,n,r,a,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PageTreeNodeDragHandler=t.ToolbarDragHandler=void 0,s=__importDefault(s);class i{static get(e,t){return n.html`<div class="node-dd node-dd--nodrop">
        <div class="node-dd__ctrl-icon"></div>
        <div class="node-dd__text">
            <span class="node-dd__icon">
                <svg aria-hidden="true" style="width: 16px; height: 16px">
                    <use xlink:ref="${e}"></use>
                </svg>
            </span>
            <span class="node-dd__name">${t}</span>
        </div>
    </div>`}}t.ToolbarDragHandler=class{constructor(e,t,s){this.startDrag=!1,this.startPageX=0,this.startPageY=0,this.id="",this.name="",this.tooltip="",this.icon="",this.isDragged=!1,this.id=e.nodeType,this.name=e.title,this.tooltip=e.tooltip,this.icon=e.icon,this.tree=t,this.dragDrop=s}dragStart(e){return this.isDragged=!1,this.startDrag=!1,this.startPageX=e.sourceEvent.pageX,this.startPageY=e.sourceEvent.pageY,!0}dragDragged(e){if(!this.dragDrop.isDragNodeDistanceMore(e,this))return!1;if(this.startDrag=!0,!1===this.isDragged){this.isDragged=!0;let e=s.default(this.tree.svg.node());e.after(s.default(r.renderNodes(i.get("#icon-"+this.icon,this.name)))),e.find(".nodes-wrapper").addClass("nodes-wrapper--dragging")}let t=18,n=15;return e.sourceEvent&&e.sourceEvent.pageX&&(t+=e.sourceEvent.pageX),e.sourceEvent&&e.sourceEvent.pageY&&(n+=e.sourceEvent.pageY),this.dragDrop.openNodeTimeout(),s.default(document).find(".node-dd").css({left:t,top:n,display:"block"}),this.dragDrop.changeNodeClasses(e),!0}dragEnd(e){if(!this.startDrag)return!1;let t=s.default(this.tree.svg.node()),n=t.find(".nodes-bg"),r=t.find(".nodes-wrapper");return this.isDragged=!1,this.dragDrop.addNodeDdClass(r,null,"",!0),n.find(".node-bg.node-bg--dragging").removeClass("node-bg--dragging"),t.siblings(".node-dd").remove(),this.tree.nodesBgContainer.selectAll(".node-bg__border").style("display","none"),!(!0!==this.tree.settings.isDragAnDrop||!this.tree.hoveredNode||!this.tree.isOverSvg)&&(this.tree.settings.canNodeDrag&&this.tree.addNewNode({type:this.id,name:this.name,tooltip:this.tooltip,icon:this.icon,position:this.tree.settings.nodeDragPosition,target:this.tree.hoveredNode}),!0)}};t.PageTreeNodeDragHandler=class{constructor(e,t){this.startDrag=!1,this.startPageX=0,this.startPageY=0,this.isDragged=!1,this.nodeIsOverDelete=!1,this.tree=e,this.dragDrop=t}dragStart(e){let t=e.subject;return!0===this.tree.settings.isDragAnDrop&&0!==t.depth&&(this.dropZoneDelete=null,t.allowDelete&&(this.dropZoneDelete=this.tree.nodesContainer.select('.node[data-state-id="'+t.stateIdentifier+'"]').append("g").attr("class","nodes-drop-zone").attr("height",this.tree.settings.nodeHeight),this.nodeIsOverDelete=!1,this.dropZoneDelete.append("rect").attr("height",this.tree.settings.nodeHeight).attr("width","50px").attr("x",0).attr("y",0).on("mouseover",()=>{this.nodeIsOverDelete=!0}).on("mouseout",()=>{this.nodeIsOverDelete=!1}),this.dropZoneDelete.append("text").text(TYPO3.lang.deleteItem).attr("dx",5).attr("dy",15),this.dropZoneDelete.node().dataset.open="false",this.dropZoneDelete.node().style.transform=this.getDropZoneCloseTransform(t)),this.startPageX=e.sourceEvent.pageX,this.startPageY=e.sourceEvent.pageY,this.startDrag=!1,!0)}dragDragged(e){let t=e.subject;if(!this.dragDrop.isDragNodeDistanceMore(e,this))return!1;if(this.startDrag=!0,!0!==this.tree.settings.isDragAnDrop||0===t.depth)return!1;this.tree.settings.nodeDrag=t;let n=s.default(e.sourceEvent.target).closest("svg"),a=n.find(".nodes-bg"),o=n.find(".nodes-wrapper"),d=a.find(".node-bg[data-state-id="+t.stateIdentifier+"]"),l=n.siblings(".node-dd");d.length&&!this.isDragged&&(this.tree.settings.dragging=!0,this.isDragged=!0,n.after(s.default(r.renderNodes(i.get(this.tree.getIconId(t),t.name)))),d.addClass("node-bg--dragging"),n.find(".nodes-wrapper").addClass("nodes-wrapper--dragging"));let g=18,h=15;return e.sourceEvent&&e.sourceEvent.pageX&&(g+=e.sourceEvent.pageX),e.sourceEvent&&e.sourceEvent.pageY&&(h+=e.sourceEvent.pageY),this.tree.settings.nodeDragPosition=!1,this.dragDrop.openNodeTimeout(),s.default(document).find(".node-dd").css({left:g,top:h,display:"block"}),t.isOver||this.tree.hoveredNode&&-1!==this.tree.hoveredNode.parentsStateIdentifier.indexOf(t.stateIdentifier)||!this.tree.isOverSvg?(this.dragDrop.addNodeDdClass(o,l,"nodrop"),this.tree.isOverSvg||this.tree.nodesBgContainer.selectAll(".node-bg__border").style("display","none"),this.dropZoneDelete&&"true"!==this.dropZoneDelete.node().dataset.open&&this.tree.isOverSvg&&this.animateDropZone("show",this.dropZoneDelete.node(),t)):this.tree.hoveredNode?(this.dropZoneDelete&&"false"!==this.dropZoneDelete.node().dataset.open&&this.animateDropZone("hide",this.dropZoneDelete.node(),t),this.dragDrop.changeNodeClasses(e)):(this.dragDrop.addNodeDdClass(o,l,"nodrop"),this.tree.nodesBgContainer.selectAll(".node-bg__border").style("display","none")),!0}dragEnd(e){let t=e.subject;if(this.dropZoneDelete&&"true"===this.dropZoneDelete.node().dataset.open){let e=this.dropZoneDelete;this.animateDropZone("hide",this.dropZoneDelete.node(),t,()=>{e.remove(),this.dropZoneDelete=null})}else this.dropZoneDelete=null;if(!this.startDrag||!0!==this.tree.settings.isDragAnDrop||0===t.depth)return!1;let n=s.default(e.sourceEvent.target).closest("svg"),r=n.find(".nodes-bg"),i=this.tree.hoveredNode;if(this.isDragged=!1,this.dragDrop.addNodeDdClass(n.find(".nodes-wrapper"),null,"",!0),r.find(".node-bg.node-bg--dragging").removeClass("node-bg--dragging"),n.siblings(".node-dd").remove(),this.tree.nodesBgContainer.selectAll(".node-bg__border").style("display","none"),t.isOver||i&&-1!==i.parentsStateIdentifier.indexOf(t.stateIdentifier)||!this.tree.settings.canNodeDrag||!this.tree.isOverSvg){if(this.nodeIsOverDelete){let e=this.dragDrop.changeNodePosition(i,"delete");if(this.tree.settings.displayDeleteConfirmation){a.confirm(TYPO3.lang.deleteItem,TYPO3.lang["mess.delete"].replace("%s",e.node.name),o.warning,[{text:s.default(this).data("button-close-text")||TYPO3.lang["labels.cancel"]||"Cancel",active:!0,btnClass:"btn-default",name:"cancel"},{text:s.default(this).data("button-ok-text")||TYPO3.lang["cm.delete"]||"Delete",btnClass:"btn-warning",name:"delete"}]).on("button.clicked",t=>{"delete"===t.target.name&&this.tree.sendChangeCommand(e),a.dismiss()})}else this.tree.sendChangeCommand(e)}}else{let e=this.dragDrop.changeNodePosition(i,""),t="in"===e.position?TYPO3.lang["mess.move_into"]:TYPO3.lang["mess.move_after"];t=t.replace("%s",e.node.name).replace("%s",e.target.name),a.confirm(TYPO3.lang.move_page,t,o.warning,[{text:s.default(this).data("button-close-text")||TYPO3.lang["labels.cancel"]||"Cancel",active:!0,btnClass:"btn-default",name:"cancel"},{text:s.default(this).data("button-ok-text")||TYPO3.lang["cm.copy"]||"Copy",btnClass:"btn-warning",name:"copy"},{text:s.default(this).data("button-ok-text")||TYPO3.lang["labels.move"]||"Move",btnClass:"btn-warning",name:"move"}]).on("button.clicked",t=>{const s=t.target;"move"===s.name?(e.command="move",this.tree.sendChangeCommand(e)):"copy"===s.name&&(e.command="copy",this.tree.sendChangeCommand(e)),a.dismiss()})}return!0}getDropZoneOpenTransform(e){return"translate("+((parseFloat(this.tree.svg.style("width"))||300)-58-e.x)+"px, -10px)"}getDropZoneCloseTransform(e){return"translate("+((parseFloat(this.tree.svg.style("width"))||300)-e.x)+"px, -10px)"}animateDropZone(e,t,s,n=null){t.classList.add("animating"),t.dataset.open="show"===e?"true":"false";let r=[{transform:this.getDropZoneCloseTransform(s)},{transform:this.getDropZoneOpenTransform(s)}];"show"!==e&&(r=r.reverse());const a=function(){t.style.transform=r[1].transform,t.classList.remove("animating"),n&&n()};"animate"in t?t.animate(r,{duration:300,easing:"cubic-bezier(.02, .01, .47, 1)"}).onfinish=a:a()}}}));