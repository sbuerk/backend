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
var __importDefault=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};define(["require","exports","jquery","./Enum/Severity","TYPO3/CMS/Core/Ajax/AjaxRequest","TYPO3/CMS/Core/SecurityUtility","./Icons","./Severity","bootstrap"],(function(t,e,a,n,l,s,i,o){"use strict";var d,r,c,u;a=__importDefault(a),function(t){t.modal=".t3js-modal",t.content=".t3js-modal-content",t.title=".t3js-modal-title",t.close=".t3js-modal-close",t.body=".t3js-modal-body",t.footer=".t3js-modal-footer",t.iframe=".t3js-modal-iframe",t.iconPlaceholder=".t3js-modal-icon-placeholder"}(d||(d={})),function(t){t.small="small",t.default="default",t.medium="medium",t.large="large",t.full="full"}(r||(r={})),function(t){t.default="default",t.light="light",t.dark="dark"}(c||(c={})),function(t){t.default="default",t.ajax="ajax",t.iframe="iframe"}(u||(u={}));class f{constructor(t){this.sizes=r,this.styles=c,this.types=u,this.currentModal=null,this.instances=[],this.$template=(0,a.default)('\n    <div class="t3js-modal modal fade">\n        <div class="modal-dialog">\n            <div class="t3js-modal-content modal-content">\n                <div class="modal-header">\n                    <h4 class="t3js-modal-title modal-title"></h4>\n                    <button class="t3js-modal-close close">\n                        <span aria-hidden="true">\n                            <span class="t3js-modal-icon-placeholder" data-icon="actions-close"></span>\n                        </span>\n                        <span class="sr-only"></span>\n                    </button>\n                </div>\n                <div class="t3js-modal-body modal-body"></div>\n                <div class="t3js-modal-footer modal-footer"></div>\n            </div>\n        </div>\n    </div>'),this.defaultConfiguration={type:u.default,title:"Information",content:"No content provided, please check your <code>Modal</code> configuration.",severity:n.SeverityEnum.notice,buttons:[],style:c.default,size:r.default,additionalCssClasses:[],callback:a.default.noop(),ajaxCallback:a.default.noop(),ajaxTarget:null},this.securityUtility=t,(0,a.default)(document).on("modal-dismiss",this.dismiss),this.initializeMarkupTrigger(document)}static resolveEventNameTargetElement(t){const e=t.target,a=t.currentTarget;return e.dataset&&e.dataset.eventName?e:a.dataset&&a.dataset.eventName?a:null}static createModalResponseEventFromElement(t,e){return t&&t.dataset.eventName?new CustomEvent(t.dataset.eventName,{bubbles:!0,detail:{result:e,payload:t.dataset.eventPayload||null}}):null}dismiss(){this.currentModal&&this.currentModal.modal("hide")}confirm(t,e,l=n.SeverityEnum.warning,s=[],i){return 0===s.length&&s.push({text:(0,a.default)(this).data("button-close-text")||TYPO3.lang["button.cancel"]||"Cancel",active:!0,btnClass:"btn-default",name:"cancel"},{text:(0,a.default)(this).data("button-ok-text")||TYPO3.lang["button.ok"]||"OK",btnClass:"btn-"+o.getCssClass(l),name:"ok"}),this.advanced({title:t,content:e,severity:l,buttons:s,additionalCssClasses:i,callback:t=>{t.on("button.clicked",t=>{"cancel"===t.target.getAttribute("name")?(0,a.default)(t.currentTarget).trigger("confirm.button.cancel"):"ok"===t.target.getAttribute("name")&&(0,a.default)(t.currentTarget).trigger("confirm.button.ok")})}})}loadUrl(t,e=n.SeverityEnum.info,a,l,s,i){return this.advanced({type:u.ajax,title:t,severity:e,buttons:a,ajaxCallback:s,ajaxTarget:i,content:l})}show(t,e,a=n.SeverityEnum.info,l,s){return this.advanced({type:u.default,title:t,content:e,severity:a,buttons:l,additionalCssClasses:s})}advanced(t){return t.type="string"==typeof t.type&&t.type in u?t.type:this.defaultConfiguration.type,t.title="string"==typeof t.title?t.title:this.defaultConfiguration.title,t.content="string"==typeof t.content||"object"==typeof t.content?t.content:this.defaultConfiguration.content,t.severity=void 0!==t.severity?t.severity:this.defaultConfiguration.severity,t.buttons=t.buttons||this.defaultConfiguration.buttons,t.size="string"==typeof t.size&&t.size in r?t.size:this.defaultConfiguration.size,t.style="string"==typeof t.style&&t.style in c?t.style:this.defaultConfiguration.style,t.additionalCssClasses=t.additionalCssClasses||this.defaultConfiguration.additionalCssClasses,t.callback="function"==typeof t.callback?t.callback:this.defaultConfiguration.callback,t.ajaxCallback="function"==typeof t.ajaxCallback?t.ajaxCallback:this.defaultConfiguration.ajaxCallback,t.ajaxTarget="string"==typeof t.ajaxTarget?t.ajaxTarget:this.defaultConfiguration.ajaxTarget,this.generate(t)}setButtons(t){const e=this.currentModal.find(d.footer);if(t.length>0){e.empty();for(let n=0;n<t.length;n++){const l=t[n],s=(0,a.default)("<button />",{class:"btn"});s.html("<span>"+this.securityUtility.encodeHtml(l.text,!1)+"</span>"),l.active&&s.addClass("t3js-active"),""!==l.btnClass&&s.addClass(l.btnClass),""!==l.name&&s.attr("name",l.name),l.action?s.on("click",()=>{e.find("button").not(s).addClass("disabled"),l.action.execute(s.get(0)).then(()=>{this.currentModal.modal("hide")})}):l.trigger&&s.on("click",l.trigger),l.dataAttributes&&Object.keys(l.dataAttributes).length>0&&Object.keys(l.dataAttributes).map(t=>{s.attr("data-"+t,l.dataAttributes[t])}),l.icon&&s.prepend('<span class="t3js-modal-icon-placeholder" data-icon="'+l.icon+'"></span>'),e.append(s)}e.show(),e.find("button").on("click",t=>{(0,a.default)(t.currentTarget).trigger("button.clicked")})}else e.hide();return this.currentModal}initializeMarkupTrigger(t){(0,a.default)(t).on("click",".t3js-modal-trigger",t=>{t.preventDefault();const e=(0,a.default)(t.currentTarget),l=e.data("bs-content")||"Are you sure?",s=void 0!==n.SeverityEnum[e.data("severity")]?n.SeverityEnum[e.data("severity")]:n.SeverityEnum.info;let i=e.data("url")||null;if(null!==i){const t=i.includes("?")?"&":"?";i=i+t+a.default.param({data:e.data()})}this.advanced({type:null!==i?u.ajax:u.default,title:e.data("title")||"Alert",content:null!==i?i:l,severity:s,buttons:[{text:e.data("button-close-text")||TYPO3.lang["button.close"]||"Close",active:!0,btnClass:"btn-default",trigger:()=>{this.currentModal.trigger("modal-dismiss");const e=f.resolveEventNameTargetElement(t),a=f.createModalResponseEventFromElement(e,!1);null!==a&&e.dispatchEvent(a)}},{text:e.data("button-ok-text")||TYPO3.lang["button.ok"]||"OK",btnClass:"btn-"+o.getCssClass(s),trigger:()=>{this.currentModal.trigger("modal-dismiss");const a=f.resolveEventNameTargetElement(t),n=f.createModalResponseEventFromElement(a,!0);null!==n&&a.dispatchEvent(n);let l=e.attr("data-uri")||e.data("href")||e.attr("href");l&&"#"!==l&&(t.target.ownerDocument.location.href=l)}}]})})}generate(t){const e=this.$template.clone();if(t.additionalCssClasses.length>0)for(let a of t.additionalCssClasses)e.addClass(a);if(e.addClass("modal-type-"+t.type),e.addClass("modal-severity-"+o.getCssClass(t.severity)),e.addClass("modal-style-"+t.style),e.addClass("modal-size-"+t.size),e.attr("tabindex","-1"),e.find(d.title).text(t.title),e.find(d.close).on("click",()=>{e.modal("hide")}),"ajax"===t.type){const a=t.ajaxTarget?t.ajaxTarget:d.body,n=e.find(a);i.getIcon("spinner-circle",i.sizes.default,null,null,i.markupIdentifiers.inline).then(e=>{n.html('<div class="modal-loading">'+e+"</div>"),new l(t.content).get().then(async e=>{const n=await e.raw().text();this.currentModal.parent().length||this.currentModal.appendTo("body"),this.currentModal.find(a).empty().append(n),t.ajaxCallback&&t.ajaxCallback(),this.currentModal.trigger("modal-loaded")})})}else"iframe"===t.type?(e.find(d.body).append((0,a.default)("<iframe />",{src:t.content,name:"modal_frame",class:"modal-iframe t3js-modal-iframe"})),e.find(d.iframe).on("load",()=>{e.find(d.title).text(e.find(d.iframe).get(0).contentDocument.title)})):("string"==typeof t.content&&(t.content=(0,a.default)("<p />").html(this.securityUtility.encodeHtml(t.content))),e.find(d.body).append(t.content));return e.on("shown.bs.modal",t=>{const e=(0,a.default)(t.currentTarget),n=e.prev(".modal-backdrop"),l=1e3+10*this.instances.length,s=l-10;e.css("z-index",l),n.css("z-index",s),e.find(d.footer).find(".t3js-active").first().focus(),e.find(d.iconPlaceholder).each((t,e)=>{i.getIcon((0,a.default)(e).data("icon"),i.sizes.small,null,null,i.markupIdentifiers.inline).then(t=>{this.currentModal.find(d.iconPlaceholder+"[data-icon="+(0,a.default)(t).data("identifier")+"]").replaceWith(t)})})}),e.on("hide.bs.modal",()=>{if(this.instances.length>0){const t=this.instances.length-1;this.instances.splice(t,1),this.currentModal=this.instances[t-1]}}),e.on("hidden.bs.modal",t=>{e.trigger("modal-destroyed"),(0,a.default)(t.currentTarget).remove(),this.instances.length>0&&(0,a.default)("body").addClass("modal-open")}),e.on("show.bs.modal",e=>{this.currentModal=(0,a.default)(e.currentTarget),this.setButtons(t.buttons),this.instances.push(this.currentModal)}),e.on("modal-dismiss",t=>{(0,a.default)(t.currentTarget).modal("hide")}),t.callback&&t.callback(e),e.modal("show"),e}}let m=null;try{parent&&parent.window.TYPO3&&parent.window.TYPO3.Modal?(parent.window.TYPO3.Modal.initializeMarkupTrigger(document),m=parent.window.TYPO3.Modal):top&&top.TYPO3.Modal&&(top.TYPO3.Modal.initializeMarkupTrigger(document),m=top.TYPO3.Modal)}catch(t){}return m||(m=new f(new s),TYPO3.Modal=m),m}));