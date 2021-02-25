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
var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,s,i){void 0===i&&(i=s),Object.defineProperty(e,i,{enumerable:!0,get:function(){return t[s]}})}:function(e,t,s,i){void 0===i&&(i=s),e[i]=t[s]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__decorate=this&&this.__decorate||function(e,t,s,i){var n,o=arguments.length,r=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(r=(o<3?n(r):o>3?n(t,s,r):n(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)"default"!==s&&Object.prototype.hasOwnProperty.call(e,s)&&__createBinding(t,e,s);return __setModuleDefault(t,e),t},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};define(["require","exports","lit","lit/decorators","d3-selection","TYPO3/CMS/Core/Ajax/AjaxRequest","./Notification","./Enum/KeyTypes","./Icons","./Tooltip","./Enum/IconTypes","TYPO3/CMS/Core/lit-helper","TYPO3/CMS/Core/Event/DebounceEvent","TYPO3/CMS/Backend/Element/IconElement","TYPO3/CMS/Backend/Input/Clearable"],(function(e,t,s,i,n,o,r,a,d,l,h,c,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Toolbar=t.SvgTree=void 0,n=__importStar(n),o=__importDefault(o),u=__importDefault(u);class p extends s.LitElement{constructor(){super(...arguments),this.setup=null,this.settings={showIcons:!1,marginTop:15,nodeHeight:20,indentWidth:16,width:300,duration:400,dataUrl:"",filterUrl:"",defaultProperties:{},expandUpToLevel:null,actions:[]},this.isOverSvg=!1,this.svg=null,this.container=null,this.nodesContainer=null,this.nodesBgContainer=null,this.hoveredNode=null,this.nodes=[],this.textPosition=10,this.icons={},this.nodesActionsContainer=null,this.iconsContainer=null,this.linksContainer=null,this.data=new class{constructor(){this.links=[],this.nodes=[]}},this.viewportHeight=0,this.scrollBottom=0,this.searchTerm=null,this.unfilteredNodes="",this.networkErrorTitle=top.TYPO3.lang.tree_networkError,this.networkErrorMessage=top.TYPO3.lang.tree_networkErrorDescription,this.tooltipOptions={}}doSetup(e){Object.assign(this.settings,e),this.settings.showIcons&&(this.textPosition+=20),this.svg=n.select(this).select("svg"),this.container=this.svg.select(".nodes-wrapper"),this.nodesBgContainer=this.container.select(".nodes-bg"),this.nodesActionsContainer=this.container.select(".nodes-actions"),this.linksContainer=this.container.select(".links"),this.nodesContainer=this.container.select(".nodes"),this.iconsContainer=this.svg.select("defs"),this.tooltipOptions={delay:50,trigger:"hover",placement:"right",container:"#"+this.id},this.updateScrollPosition(),this.loadData(),this.dispatchEvent(new Event("svg-tree:initialized"))}switchFocus(e){if(null===e)return;e.parentNode.querySelectorAll("[tabindex]").forEach(e=>{e.setAttribute("tabindex","-1")}),e.setAttribute("tabindex","0"),e.focus()}switchFocusNode(e){this.switchFocus(this.getNodeElement(e))}getNodeElement(e){return this.querySelector("#identifier-"+this.getNodeStateIdentifier(e))}loadData(){this.nodesAddPlaceholder(),new o.default(this.settings.dataUrl).get({cache:"no-cache"}).then(e=>e.resolve()).then(e=>{const t=Array.isArray(e)?e:[];this.replaceData(t),this.nodesRemovePlaceholder(),this.updateScrollPosition(),this.updateVisibleNodes()}).catch(e=>{throw this.errorNotification(e,!1),this.nodesRemovePlaceholder(),e})}replaceData(e){this.setParametersNode(e),this.prepareDataForVisibleNodes(),this.nodesContainer.selectAll(".node").remove(),this.nodesBgContainer.selectAll(".node-bg").remove(),this.nodesActionsContainer.selectAll(".node-action").remove(),this.linksContainer.selectAll(".link").remove(),this.updateVisibleNodes()}setParametersNode(e=null){1===(e=(e=e||this.nodes).map((t,s)=>{if(void 0===t.command&&(t=Object.assign({},this.settings.defaultProperties,t)),t.expanded=null!==this.settings.expandUpToLevel?t.depth<this.settings.expandUpToLevel:Boolean(t.expanded),t.parents=[],t.parentsStateIdentifier=[],t.depth>0){let i=t.depth;for(let n=s;n>=0;n--){let s=e[n];s.depth<i&&(t.parents.push(n),t.parentsStateIdentifier.push(e[n].stateIdentifier),i=s.depth)}}return void 0===t.checked&&(t.checked=!1),t})).filter(e=>0===e.depth).length&&(e[0].expanded=!0);const t=new CustomEvent("typo3:svg-tree:nodes-prepared",{detail:{nodes:e},bubbles:!1});this.dispatchEvent(t),this.nodes=t.detail.nodes}nodesRemovePlaceholder(){const e=this.querySelector(".node-loader");e&&(e.style.display="none");const t=this.closest(".svg-tree"),s=null==t?void 0:t.querySelector(".svg-tree-loader");s&&(s.style.display="none")}nodesAddPlaceholder(e=null){if(e){const t=this.querySelector(".node-loader");t&&(t.style.top=""+(e.y+this.settings.marginTop),t.style.display="block")}else{const e=this.closest(".svg-tree"),t=null==e?void 0:e.querySelector(".svg-tree-loader");t&&(t.style.display="block")}}hideChildren(e){e.expanded=!1,this.setExpandedState(e),this.dispatchEvent(new CustomEvent("typo3:svg-tree:expand-toggle",{detail:{node:e}}))}showChildren(e){e.expanded=!0,this.setExpandedState(e),this.dispatchEvent(new CustomEvent("typo3:svg-tree:expand-toggle",{detail:{node:e}}))}setExpandedState(e){const t=this.getNodeElement(e);t&&(e.hasChildren?t.setAttribute("aria-expanded",e.expanded?"true":"false"):t.removeAttribute("aria-expanded"))}refreshTree(){this.loadData()}refreshOrFilterTree(){""!==this.searchTerm?this.filter(this.searchTerm):this.refreshTree()}prepareDataForVisibleNodes(){const e={};this.nodes.forEach((t,s)=>{t.expanded||(e[s]=!0)}),this.data.nodes=this.nodes.filter(t=>!0!==t.hidden&&!t.parents.some(t=>Boolean(e[t]))),this.data.links=[];let t=0;this.data.nodes.forEach((e,s)=>{e.x=e.depth*this.settings.indentWidth,e.readableRootline&&(t+=this.settings.nodeHeight),e.y=s*this.settings.nodeHeight+t,void 0!==e.parents[0]&&this.data.links.push({source:this.nodes[e.parents[0]],target:e}),this.settings.showIcons&&(this.fetchIcon(e.icon),this.fetchIcon(e.overlayIcon),e.locked&&this.fetchIcon("warning-in-use"))}),this.svg.attr("height",this.data.nodes.length*this.settings.nodeHeight+this.settings.nodeHeight/2+t)}fetchIcon(e,t=!0){e&&(e in this.icons||(this.icons[e]={identifier:e,icon:""},d.getIcon(e,d.sizes.small,null,null,h.MarkupIdentifiers.inline).then(s=>{let i=s.match(/<svg[\s\S]*<\/svg>/i);i&&(this.icons[e].icon=i[0]),t&&this.updateVisibleNodes()})))}updateVisibleNodes(){const e=Math.ceil(this.viewportHeight/this.settings.nodeHeight+1),t=Math.floor(Math.max(this.scrollTop-2*this.settings.nodeHeight,0)/this.settings.nodeHeight),s=this.data.nodes.slice(t,t+e),i=this.querySelector('[tabindex="0"]'),o=s.find(e=>e.checked);let r=this.nodesContainer.selectAll(".node").data(s,e=>e.stateIdentifier);const a=this.nodesBgContainer.selectAll(".node-bg").data(s,e=>e.stateIdentifier),d=this.nodesActionsContainer.selectAll(".node-action").data(s,e=>e.stateIdentifier);r.exit().remove(),a.exit().remove(),d.exit().remove(),this.updateNodeActions(d);const l=this.updateNodeBgClass(a);l.attr("class",(e,t)=>this.getNodeBgClass(e,t,l)).attr("style",e=>e.backgroundColor?"fill: "+e.backgroundColor+";":""),this.updateLinks(),r=this.enterSvgElements(r),r.attr("tabindex",(e,t)=>{if(void 0!==o){if(o===e)return"0"}else if(null===i){if(0===t)return"0"}else if(n.select(i).datum()===e)return"0";return"-1"}).attr("transform",this.getNodeTransform).select(".node-name").html(e=>this.getNodeLabel(e)),r.select(".chevron").attr("transform",this.getChevronTransform).style("fill",this.getChevronColor).attr("class",this.getChevronClass),r.select(".toggle").attr("visibility",this.getToggleVisibility),this.settings.showIcons&&(r.select("use.node-icon").attr("xlink:href",this.getIconId),r.select("use.node-icon-overlay").attr("xlink:href",this.getIconOverlayId),r.select("use.node-icon-locked").attr("xlink:href",e=>"#icon-"+(e.locked?"warning-in-use":"")))}updateNodeBgClass(e){return e.enter().append("rect").merge(e).attr("width","100%").attr("height",this.settings.nodeHeight).attr("data-state-id",this.getNodeStateIdentifier).attr("transform",this.getNodeBgTransform).on("mouseover",(e,t)=>this.onMouseOverNode(t)).on("mouseout",(e,t)=>this.onMouseOutOfNode(t)).on("click",(e,t)=>{this.selectNode(t),this.switchFocusNode(t)}).on("contextmenu",(e,t)=>{this.dispatchEvent(new CustomEvent("typo3:svg-tree:node-context",{detail:{node:t}}))})}getIconId(e){return"#icon-"+e.icon}getIconOverlayId(e){return"#icon-"+e.overlayIcon}selectNode(e){this.isNodeSelectable(e)&&(this.disableSelectedNodes(),e.checked=!0,this.dispatchEvent(new CustomEvent("typo3:svg-tree:node-selected",{detail:{node:e}})),this.updateVisibleNodes())}filter(e){"string"==typeof e&&(this.searchTerm=e),this.nodesAddPlaceholder(),this.searchTerm&&this.settings.filterUrl?new o.default(this.settings.filterUrl+"&q="+this.searchTerm).get({cache:"no-cache"}).then(e=>e.resolve()).then(e=>{let t=Array.isArray(e)?e:[];t.length>0&&(""===this.unfilteredNodes&&(this.unfilteredNodes=JSON.stringify(this.nodes)),this.replaceData(t)),this.nodesRemovePlaceholder()}).catch(e=>{throw this.errorNotification(e,!1),this.nodesRemovePlaceholder(),e}):this.resetFilter()}resetFilter(){if(this.searchTerm="",this.unfilteredNodes.length>0){let e=this.getSelectedNodes()[0];if(void 0===e)return void this.refreshTree();this.nodes=JSON.parse(this.unfilteredNodes),this.unfilteredNodes="";const t=this.getNodeByIdentifier(e.stateIdentifier);t?this.selectNode(t):this.refreshTree()}else this.refreshTree();this.prepareDataForVisibleNodes(),this.updateVisibleNodes()}errorNotification(e=null,t=!1){if(Array.isArray(e))e.forEach(e=>{r.error(e.title,e.message)});else{let t=this.networkErrorTitle;e&&e.target&&(e.target.status||e.target.statusText)&&(t+=" - "+(e.target.status||"")+" "+(e.target.statusText||"")),r.error(t,this.networkErrorMessage)}t&&this.loadData()}connectedCallback(){super.connectedCallback(),this.addEventListener("resize",()=>this.updateView()),this.addEventListener("scroll",()=>this.updateView()),this.addEventListener("svg-tree:visible",()=>this.updateView()),window.addEventListener("resize",()=>{this.getClientRects().length>0&&this.updateView()})}getSelectedNodes(){return this.nodes.filter(e=>e.checked)}createRenderRoot(){return this}render(){return s.html`
      <div class="node-loader">
        <typo3-backend-icon identifier="spinner-circle-light" size="small"></typo3-backend-icon>
      </div>
      <svg version="1.1"
           width="100%"
           @mouseover=${()=>this.isOverSvg=!0}
           @mouseout=${()=>this.isOverSvg=!1}
           @keydown=${e=>this.handleKeyboardInteraction(e)}>
        <g class="nodes-wrapper" transform="translate(${this.settings.indentWidth/2},${this.settings.nodeHeight/2})">
          <g class="nodes-bg"></g>
          <g class="links"></g>
          <g class="nodes" role="tree"></g>
          <g class="nodes-actions"></g>
        </g>
        <defs></defs>
      </svg>
    `}firstUpdated(){this.svg=n.select(this.querySelector("svg")),this.container=n.select(this.querySelector(".nodes-wrapper")).attr("transform","translate("+this.settings.indentWidth/2+","+this.settings.nodeHeight/2+")"),this.nodesBgContainer=n.select(this.querySelector(".nodes-bg")),this.nodesActionsContainer=n.select(this.querySelector(".nodes-actions")),this.linksContainer=n.select(this.querySelector(".links")),this.nodesContainer=n.select(this.querySelector(".nodes")),this.doSetup(this.setup||{}),this.updateView()}updateView(){this.updateScrollPosition(),this.updateVisibleNodes(),this.settings.actions&&this.settings.actions.length&&this.nodesActionsContainer.attr("transform","translate("+(this.querySelector("svg").clientWidth-16-16*this.settings.actions.length)+",0)")}disableSelectedNodes(){this.getSelectedNodes().forEach(e=>{!0===e.checked&&(e.checked=!1)})}updateNodeActions(e){return this.settings.actions&&this.settings.actions.length?e.enter().append("g").merge(e).attr("class","node-action").on("mouseover",(e,t)=>this.onMouseOverNode(t)).on("mouseout",(e,t)=>this.onMouseOutOfNode(t)).attr("data-state-id",this.getNodeStateIdentifier).attr("transform",this.getNodeActionTransform):e.enter()}isNodeSelectable(e){return!0}appendTextElement(e){return e.append("text").attr("dx",e=>this.textPosition+(e.locked?15:0)).attr("dy",5).attr("class","node-name").on("click",(e,t)=>this.selectNode(t))}nodesUpdate(e){return(e=e.enter().append("g").attr("class",this.getNodeClass).attr("id",e=>"identifier-"+e.stateIdentifier).attr("role","treeitem").attr("aria-owns",e=>e.hasChildren?"group-identifier-"+e.stateIdentifier:null).attr("aria-level",this.getNodeDepth).attr("aria-setsize",this.getNodeSetsize).attr("aria-posinset",this.getNodePositionInSet).attr("aria-expanded",e=>e.hasChildren?e.expanded:null).attr("transform",this.getNodeTransform).attr("data-state-id",this.getNodeStateIdentifier).attr("title",this.getNodeTitle).on("mouseover",(e,t)=>this.onMouseOverNode(t)).on("mouseout",(e,t)=>this.onMouseOutOfNode(t)).on("contextmenu",(e,t)=>{e.preventDefault(),this.dispatchEvent(new CustomEvent("typo3:svg-tree:node-context",{detail:{node:t}}))})).append("text").text(e=>e.readableRootline).attr("class","node-rootline").attr("dx",0).attr("dy",-15).attr("visibility",e=>e.readableRootline?"visible":"hidden"),e}getNodeIdentifier(e){return e.identifier}getNodeDepth(e){return e.depth}getNodeSetsize(e){return e.siblingsCount}getNodePositionInSet(e){return e.siblingsPosition}getNodeStateIdentifier(e){return e.stateIdentifier}getNodeLabel(e){let t=(e.prefix||"")+e.name+(e.suffix||"");const s=document.createElement("div");if(s.textContent=t,t=s.innerHTML,this.searchTerm){const e=new RegExp(this.searchTerm,"gi");t=t.replace(e,'<tspan class="node-highlight-text">$&</tspan>')}return t}getNodeClass(e){return"node identifier-"+e.stateIdentifier}getNodeByIdentifier(e){return this.nodes.find(t=>t.stateIdentifier===e)}getNodeBgClass(e,t,s){let i="node-bg",n=null,o=null;return"object"==typeof s&&(n=s.data()[t-1],o=s.data()[t+1]),e.checked&&(i+=" node-selected"),(n&&e.depth>n.depth||!n)&&(e.firstChild=!0,i+=" node-first-child"),(o&&e.depth>o.depth||!o)&&(e.lastChild=!0,i+=" node-last-child"),e.class&&(i+=" "+e.class),i}getNodeTitle(e){return e.tip?e.tip:"uid="+e.identifier}getChevronTransform(e){return e.expanded?"translate(16,0) rotate(90)":" rotate(0)"}getChevronColor(e){return e.expanded?"#000":"#8e8e8e"}getToggleVisibility(e){return e.hasChildren?"visible":"hidden"}getChevronClass(e){return"chevron "+(e.expanded?"expanded":"collapsed")}getLinkPath(e){const t=e.target.x,s=e.target.y,i=[];return i.push("M"+e.source.x+" "+e.source.y),i.push("V"+s),e.target.hasChildren?i.push("H"+(t-2)):i.push("H"+(t+this.settings.indentWidth/4-2)),i.join(" ")}getNodeTransform(e){return"translate("+(e.x||0)+","+(e.y||0)+")"}getNodeBgTransform(e){return"translate(-8, "+((e.y||0)-10)+")"}getNodeActionTransform(e){return"translate(0, "+((e.y||0)-9)+")"}clickOnIcon(e){this.dispatchEvent(new CustomEvent("typo3:svg-tree:node-context",{detail:{node:e}}))}chevronClick(e){e.expanded?this.hideChildren(e):this.showChildren(e),this.prepareDataForVisibleNodes(),this.updateVisibleNodes()}enterSvgElements(e){if(this.settings.showIcons){const e=Object.values(this.icons).filter(e=>""!==e.icon),t=this.iconsContainer.selectAll(".icon-def").data(e,e=>e.identifier);t.exit().remove(),t.enter().append("g").attr("class","icon-def").attr("id",e=>"icon-"+e.identifier).append(e=>{const t=new DOMParser,s='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+e.icon.replace("<svg","<g").replace("/svg>","/g>")+"</svg>";return t.parseFromString(s,"image/svg+xml").documentElement.firstChild})}const t=this.nodesUpdate(e);let s=t.append("g").attr("class","toggle").attr("visibility",this.getToggleVisibility).attr("transform","translate(-8, -8)").on("click",(e,t)=>this.chevronClick(t));if(s.append("path").style("opacity",0).attr("d","M 0 0 L 16 0 L 16 16 L 0 16 Z"),s.append("path").attr("class","chevron").attr("d","M 4 3 L 13 8 L 4 13 Z"),this.settings.showIcons){const e=t.append("g").attr("class","node-icon-container").attr("title",this.getNodeTitle).attr("data-bs-toggle","tooltip").on("click",(e,t)=>{e.preventDefault(),this.clickOnIcon(t)});e.append("rect").style("opacity",0).attr("width","20").attr("height","20").attr("x","6").attr("y","-10"),e.append("use").attr("class","node-icon").attr("data-uid",this.getNodeIdentifier).attr("transform","translate(8, -8)"),e.append("use").attr("transform","translate(8, -3)").attr("class","node-icon-overlay"),e.append("use").attr("x",27).attr("y",-7).attr("class","node-icon-locked")}return l.initialize('[data-bs-toggle="tooltip"]',this.tooltipOptions),this.appendTextElement(t),e.merge(t)}updateScrollPosition(){this.viewportHeight=this.getBoundingClientRect().height,this.scrollBottom=this.scrollTop+this.viewportHeight+this.viewportHeight/2,setTimeout(()=>{l.hide(this.querySelectorAll(".bs-tooltip-end"))},this.tooltipOptions.delay)}onMouseOverNode(e){e.isOver=!0,this.hoveredNode=e;let t=this.svg.select('.nodes-bg .node-bg[data-state-id="'+e.stateIdentifier+'"]');t.size()&&t.classed("node-over",!0).attr("rx","3").attr("ry","3");let s=this.nodesActionsContainer.select('.node-action[data-state-id="'+e.stateIdentifier+'"]');s.size()&&(s.classed("node-action-over",!0),s.attr("fill",t.style("fill")))}onMouseOutOfNode(e){e.isOver=!1,this.hoveredNode=null;let t=this.svg.select('.nodes-bg .node-bg[data-state-id="'+e.stateIdentifier+'"]');t.size()&&t.classed("node-over node-alert",!1).attr("rx","0").attr("ry","0");let s=this.nodesActionsContainer.select('.node-action[data-state-id="'+e.stateIdentifier+'"]');s.size()&&s.classed("node-action-over",!1)}handleKeyboardInteraction(e){const t=e.target;let s=n.select(t).datum();if(-1===[a.KeyTypesEnum.ENTER,a.KeyTypesEnum.SPACE,a.KeyTypesEnum.END,a.KeyTypesEnum.HOME,a.KeyTypesEnum.LEFT,a.KeyTypesEnum.UP,a.KeyTypesEnum.RIGHT,a.KeyTypesEnum.DOWN].indexOf(e.keyCode))return;e.preventDefault();const i=t.parentNode;switch(e.keyCode){case a.KeyTypesEnum.END:this.scrollTop=this.lastElementChild.getBoundingClientRect().height+this.settings.nodeHeight-this.viewportHeight,i.scrollIntoView({behavior:"smooth",block:"end"}),this.updateVisibleNodes(),this.switchFocus(i.lastElementChild);break;case a.KeyTypesEnum.HOME:this.scrollTo({top:this.nodes[0].y,behavior:"smooth"}),this.prepareDataForVisibleNodes(),this.updateVisibleNodes(),this.switchFocus(i.firstElementChild);break;case a.KeyTypesEnum.LEFT:if(s.expanded)s.hasChildren&&(this.hideChildren(s),this.prepareDataForVisibleNodes(),this.updateVisibleNodes());else if(s.parents.length>0){let e=this.nodes[s.parents[0]];this.scrollNodeIntoVisibleArea(e,"up"),this.switchFocusNode(e)}break;case a.KeyTypesEnum.UP:this.scrollNodeIntoVisibleArea(s,"up"),this.switchFocus(t.previousSibling);break;case a.KeyTypesEnum.RIGHT:s.expanded?(this.scrollNodeIntoVisibleArea(s,"down"),this.switchFocus(t.nextSibling)):s.hasChildren&&(this.showChildren(s),this.prepareDataForVisibleNodes(),this.updateVisibleNodes(),this.switchFocus(t));break;case a.KeyTypesEnum.DOWN:this.scrollNodeIntoVisibleArea(s,"down"),this.switchFocus(t.nextSibling);break;case a.KeyTypesEnum.ENTER:case a.KeyTypesEnum.SPACE:this.selectNode(s)}}scrollNodeIntoVisibleArea(e,t="up"){let s=this.scrollTop;if("up"===t&&s>e.y-this.settings.nodeHeight)s=e.y-this.settings.nodeHeight;else{if(!("down"===t&&s+this.viewportHeight<=e.y+3*this.settings.nodeHeight))return;s+=this.settings.nodeHeight}this.scrollTo({top:s,behavior:"smooth"}),this.updateVisibleNodes()}updateLinks(){const e=this.data.links.filter(e=>e.source.y<=this.scrollBottom&&e.target.y>=this.scrollTop-this.settings.nodeHeight).map(e=>(e.source.owns=e.source.owns||[],e.source.owns.push("identifier-"+e.target.stateIdentifier),e)),t=this.linksContainer.selectAll(".link").data(e);t.exit().remove(),t.enter().append("path").attr("class","link").attr("id",this.getGroupIdentifier).attr("role",e=>1===e.target.siblingsPosition&&e.source.owns.length>0?"group":null).attr("aria-owns",e=>1===e.target.siblingsPosition&&e.source.owns.length>0?e.source.owns.join(" "):null).merge(t).attr("d",e=>this.getLinkPath(e))}getGroupIdentifier(e){return 1===e.target.siblingsPosition?"group-identifier-"+e.source.stateIdentifier:null}}__decorate([i.property({type:Object})],p.prototype,"setup",void 0),__decorate([i.state()],p.prototype,"settings",void 0),t.SvgTree=p;let g=class extends s.LitElement{constructor(){super(...arguments),this.tree=null,this.settings={searchInput:".search-input",filterTimeout:450}}createRenderRoot(){return this}firstUpdated(){const e=this.querySelector(this.settings.searchInput);e&&(new u.default("input",e=>{const t=e.target;this.tree.filter(t.value.trim())},this.settings.filterTimeout).bindTo(e),e.focus(),e.clearable({onClear:()=>{this.tree.resetFilter()}}))}render(){return s.html`
      <div class="tree-toolbar">
        <div class="svg-toolbar__menu">
          <div class="svg-toolbar__search">
              <input type="text" class="form-control form-control-sm search-input" placeholder="${c.lll("tree.searchTermInfo")}">
          </div>
          <button class="btn btn-default btn-borderless btn-sm" @click="${()=>this.refreshTree()}" data-tree-icon="actions-refresh" title="${c.lll("labels.refresh")}">
            <typo3-backend-icon identifier="actions-refresh" size="small"></typo3-backend-icon>
          </button>
        </div>
      </div>
    `}refreshTree(){this.tree.refreshOrFilterTree()}};__decorate([i.property({type:p})],g.prototype,"tree",void 0),g=__decorate([i.customElement("typo3-backend-tree-toolbar")],g),t.Toolbar=g}));