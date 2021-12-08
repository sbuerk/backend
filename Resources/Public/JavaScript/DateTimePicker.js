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
define(["require","exports","flatpickr/flatpickr.min","moment","./Storage/Persistent","TYPO3/CMS/Core/Event/ThrottleEvent"],(function(e,t,a,n,i,r){"use strict";class o{constructor(){var e;this.format=(void 0!==(null===(e=null===opener||void 0===opener?void 0:opener.top)||void 0===e?void 0:e.TYPO3)?opener.top:top).TYPO3.settings.DateTimePicker.DateFormat}static formatDateForHiddenField(e,t){return"time"!==t&&"timesec"!==t||e.year(1970).month(0).date(1),e.format()}initialize(t){if(!(t instanceof HTMLInputElement)||void 0!==t.dataset.datepickerInitialized)return;let a=i.get("lang");""===a?a="default":"ch"===a&&(a="zh"),t.dataset.datepickerInitialized="1",e(["flatpickr/locales"],()=>{this.initializeField(t,a)})}initializeField(e,t){const i=this.getScrollEvent(),r=this.getDateOptions(e);r.locale=t,r.onOpen=[()=>{i.bindTo(document.querySelector(".t3js-module-body"))}],r.onClose=()=>{i.release()};const d=a(e,r);e.addEventListener("input",()=>{const e=d._input.value,t=d.parseDate(e);e===d.formatDate(t,d.config.dateFormat)&&d.setDate(e)}),e.addEventListener("change",t=>{t.stopImmediatePropagation();const a=t.target,i=e.parentElement.parentElement.querySelector('input[type="hidden"]');if(""!==a.value){const e=a.dataset.dateType,t=n.utc(a.value,a._flatpickr.config.dateFormat);t.isValid()?i.value=o.formatDateForHiddenField(t,e):a.value=o.formatDateForHiddenField(n.utc(i.value),e)}else i.value="";a.dispatchEvent(new Event("formengine.dp.change"))})}getScrollEvent(){return new r("scroll",()=>{const e=document.querySelector(".flatpickr-input.active");if(null===e)return;const t=e.getBoundingClientRect(),a=e._flatpickr.calendarContainer.offsetHeight;let n,i;window.innerHeight-t.bottom<a&&t.top>a?(n=t.y-a-2,i="arrowBottom"):(n=t.y+t.height+2,i="arrowTop"),e._flatpickr.calendarContainer.style.top=n+"px",e._flatpickr.calendarContainer.classList.remove("arrowBottom","arrowTop"),e._flatpickr.calendarContainer.classList.add(i)},15)}getDateOptions(e){const t=this.format,a=e.dataset.dateType,i={allowInput:!0,dateFormat:"",defaultDate:e.value,enableSeconds:!1,enableTime:!1,formatDate:(e,t)=>n(e).format(t),parseDate:(e,t)=>n(e,t,!0).toDate(),maxDate:"",minDate:"",minuteIncrement:1,noCalendar:!1,weekNumbers:!0};switch(a){case"datetime":i.dateFormat=t[1],i.enableTime=!0;break;case"date":i.dateFormat=t[0];break;case"time":i.dateFormat="HH:mm",i.enableTime=!0,i.noCalendar=!0;break;case"timesec":i.dateFormat="HH:mm:ss",i.enableSeconds=!0,i.enableTime=!0,i.noCalendar=!0;break;case"year":i.dateFormat="Y"}return"undefined"!==e.dataset.dateMindate&&(i.minDate=e.dataset.dateMindate),"undefined"!==e.dataset.dateMaxdate&&(i.maxDate=e.dataset.dateMaxdate),i}}return new o}));