(function(){var L=YAHOO.util.Dom,I=YAHOO.util.Event,B=YAHOO.util.KeyListener;var E=Alfresco.util.encodeHTML,p=Alfresco.util.hasEventInterest,A=Alfresco.util.combinePaths;Alfresco.ObjectFinder=function a(W,X){Alfresco.ObjectFinder.superclass.constructor.call(this,"Alfresco.ObjectFinder",W,["button","menu","container","resize","datasource","datatable"]);this.currentValueHtmlId=X;this.eventGroup=W;YAHOO.Bubbling.on("renderCurrentValue",this.onRenderCurrentValue,this);YAHOO.Bubbling.on("selectedItemAdded",this.onSelectedItemAdded,this);YAHOO.Bubbling.on("selectedItemRemoved",this.onSelectedItemRemoved,this);YAHOO.Bubbling.on("parentChanged",this.onParentChanged,this);YAHOO.Bubbling.on("parentDetails",this.onParentDetails,this);YAHOO.Bubbling.on("formContainerDestroyed",this.onFormContainerDestroyed,this);YAHOO.Bubbling.on("removeListItem",this.onRemoveListItem,this);this.pickerId=W+"-picker";this.columns=[];this.selectedItems={};this.isReady=false;this.options.objectRenderer=new Alfresco.ObjectRenderer(this);return this};YAHOO.extend(Alfresco.ObjectFinder,Alfresco.component.Base,{options:{objectRenderer:null,selectedValue:null,currentValue:"",currentItem:null,valueType:"nodeRef",field:null,itemType:"cm:content",itemFamily:"node",compactMode:false,multipleSelectMode:true,showLinkToTarget:false,targetLinkTemplate:null,minSearchTermLength:1,maxSearchResults:100,maintainAddedRemovedItems:true,disabled:false,mandatory:false,createNewItemUri:"",createNewItemIcon:"",displayMode:"items",listItemActions:[],allowRemoveAction:true,allowRemoveAllAction:true,allowSelectAction:true,allowNavigationToContentChildren:false,selectActionLabel:null,selectActionLabelId:null,startLocation:null,startLocationParams:null,rootNode:null},columns:null,singleSelectedItem:null,selectedItems:null,isReady:false,setOptions:function r(W){Alfresco.ObjectFinder.superclass.setOptions.call(this,W);this.options.objectRenderer.setOptions(W);return this},setMessages:function M(W){Alfresco.ObjectFinder.superclass.setMessages.call(this,W);this.options.objectRenderer.setMessages(W);return this},selectItems:function C(W){this.options.selectedValue=W;this._loadSelectedItems()},onReady:function q(){this._createSelectedItemsControls();if(!this.options.disabled){if(this.options.compactMode){L.addClass(this.pickerId,"compact")}this._createNavigationControls();var Y=L.get(this.id+"-itemGroupActions");if(Y){if(this.options.allowSelectAction){var Z=document.createElement("button");Y.appendChild(Z);var X=this.options.selectActionLabel;if(this.options.selectActionLabelId&&this.options.selectActionLabelId.length!==""){X=this.msg(this.options.selectActionLabelId)}this.widgets.addButton=Alfresco.util.createYUIButton(this,null,this.onAddButtonClick,{label:X,disabled:true},Z)}if(this.options.allowRemoveAllAction&&this.options.displayMode=="list"){var W=document.createElement("button");Y.appendChild(W);this.widgets.removeAllButton=Alfresco.util.createYUIButton(this,null,this.onRemoveAllButtonClick,{label:this.msg("button.removeAll"),disabled:true},W)}}if(this.options.allowRemoveAction&&this.options.displayMode=="list"){this.options.listItemActions.push({name:"remove-list-item",event:"removeListItem",label:"form.control.object-picker.remove-item"})}this.widgets.ok=Alfresco.util.createYUIButton(this,"ok",this.onOK);this.widgets.cancel=Alfresco.util.createYUIButton(this,"cancel",this.onCancel);L.get(this.id+"-ok-button").name="-";L.get(this.id+"-cancel-button").name="-";this.widgets.dialog=Alfresco.util.createYUIPanel(this.pickerId,{width:"60em"});this.widgets.dialog.hideEvent.subscribe(this.onCancel,null,this);L.addClass(this.pickerId,"object-finder")}this._loadSelectedItems()},destroy:function k(){try{YAHOO.Bubbling.unsubscribe("renderCurrentValue",this.onRenderCurrentValue,this);YAHOO.Bubbling.unsubscribe("selectedItemAdded",this.onSelectedItemAdded,this);YAHOO.Bubbling.unsubscribe("selectedItemRemoved",this.onSelectedItemRemoved,this);YAHOO.Bubbling.unsubscribe("parentChanged",this.onParentChanged,this);YAHOO.Bubbling.unsubscribe("parentDetails",this.onParentDetails,this);YAHOO.Bubbling.unsubscribe("formContainerDestroyed",this.onFormContainerDestroyed,this);YAHOO.Bubbling.unsubscribe("removeListItem",this.onRemoveListItem,this)}catch(W){}Alfresco.ObjectFinder.superclass.destroy.call(this)},onAddButtonClick:function T(W,Y){if(!this.widgets.escapeListener){this.widgets.escapeListener=new B(this.pickerId,{keys:B.KEY.ESCAPE},{fn:function X(Z,aa){this.onCancel();I.stopEvent(aa[1])},scope:this,correctScope:true})}this.widgets.escapeListener.enable();this.widgets.dialog.show();this._createResizer();this._populateSelectedItems();this.options.objectRenderer.onPickerShow();if(!this.options.objectRenderer.startLocationResolved&&(this.options.startLocation||this.options.rootNode)){this._resolveStartLocation()}else{this._fireRefreshEvent()}Y.set("disabled",true);I.preventDefault(W)},onRemoveAllButtonClick:function c(W,X){this.widgets.currentValuesDataTable.deleteRows(0,this.widgets.currentValuesDataTable.getRecordSet().getLength());this.selectedItems={};this.singleSelectedItem=null;this._adjustCurrentValues();I.preventDefault(W)},onFolderUp:function s(X,Y){var W=Y.get("value");YAHOO.Bubbling.fire("parentChanged",{eventGroup:this,label:W.name,nodeRef:W.nodeRef});I.preventDefault(X)},onCreateNewOK:function t(W,X){I.preventDefault(W)},onCreateNewCancel:function K(W,X){I.preventDefault(W)},onOK:function h(W,X){this.widgets.escapeListener.disable();this.widgets.dialog.hide();this.widgets.addButton.set("disabled",false);if(W){I.preventDefault(W)}YAHOO.Bubbling.fire("renderCurrentValue",{eventGroup:this})},_adjustCurrentValues:function f(){if(!this.options.disabled){var X=this.getAddedItems(),W=this.getRemovedItems(),Y=this.getSelectedItems();if(this.options.maintainAddedRemovedItems){L.get(this.id+"-added").value=X.toString();L.get(this.id+"-removed").value=W.toString()}L.get(this.currentValueHtmlId).value=Y.toString();if(Alfresco.logger.isDebugEnabled()){Alfresco.logger.debug("Hidden field '"+this.currentValueHtmlId+"' updated to '"+Y.toString()+"'")}if(this.options.mandatory){YAHOO.Bubbling.fire("mandatoryControlValueUpdated",this)}YAHOO.Bubbling.fire("formValueChanged",{eventGroup:this,addedItems:X,removedItems:W,selectedItems:Y,selectedItemsMetaData:Alfresco.util.deepCopy(this.selectedItems)});this._enableActions()}},onCancel:function G(W,X){this.widgets.escapeListener.disable();this.widgets.dialog.hide();this.widgets.addButton.set("disabled",false);if(W){I.preventDefault(W)}},onSearch:function w(){var W=L.get(this.pickerId+"-searchText").value;if(W.length<this.options.minSearchTermLength){Alfresco.util.PopupManager.displayMessage({text:this.msg("form.control.object-picker.search.enter-more",this.options.minSearchTermLength)})}else{YAHOO.Bubbling.fire("refreshItemList",{eventGroup:this,searchTerm:W})}},canItemBeSelected:function x(W){if(!this.options.multipleSelectMode&&this.singleSelectedItem!==null){return false}return(this.selectedItems[W]===undefined)},getSelectedItems:function S(){var X=[];for(var W in this.selectedItems){if(this.selectedItems.hasOwnProperty(W)){X.push(this.selectedItems[W].nodeRef)}}return X},getAddedItems:function O(){var X=[],W=Alfresco.util.arrayToObject(this.options.currentValue.split(","));for(var Y in this.selectedItems){if(this.selectedItems.hasOwnProperty(Y)){if(!(Y in W)){X.push(Y)}}}return X},getRemovedItems:function R(){var X=[],W=Alfresco.util.arrayToObject(this.options.currentValue.split(","));for(var Y in W){if(W.hasOwnProperty(Y)){if(!(Y in this.selectedItems)){X.push(Y)}}}return X},onRenderCurrentValue:function j(Y,aa){if(p(this,aa)){this._adjustCurrentValues();var ab=this.selectedItems,Z="";if(ab===null){Z='<span class="error">'+this.msg("form.control.object-picker.current.failure")+"</span>"}else{var ae,ac;if(this.options.displayMode=="list"){var X=this.widgets.currentValuesDataTable.getRecordSet().getLength();if(X>0){this.widgets.currentValuesDataTable.deleteRows(0,X)}}for(var ad in ab){if(ab.hasOwnProperty(ad)){ae=ab[ad];if(ae.type=="cm:category"&&ae.displayPath.indexOf("/categories/Tags")!==-1){ae.type="tag"}if(this.options.showLinkToTarget&&this.options.targetLinkTemplate!==null){if(this.options.displayMode=="items"){ac=null;if(YAHOO.lang.isFunction(this.options.targetLinkTemplate)){ac=this.options.targetLinkTemplate.call(this,ae)}else{var W=(ae.site)?Alfresco.constants.URL_PAGECONTEXT+"site/{site}/document-details?nodeRef={nodeRef}":Alfresco.constants.URL_PAGECONTEXT+"document-details?nodeRef={nodeRef}";ac=YAHOO.lang.substitute(W,{nodeRef:ae.nodeRef,site:ae.site})}Z+=this.options.objectRenderer.renderItem(ae,16,"<div>{icon} <a href='"+ac+"'>{name}</a></div>")}else{if(this.options.displayMode=="list"){this.widgets.currentValuesDataTable.addRow(ae)}}}else{if(this.options.displayMode=="items"){if(ae.type==="tag"){Z+=this.options.objectRenderer.renderItem(ae,null,"<div class='itemtype-tag'>{name}</div>")}else{Z+=this.options.objectRenderer.renderItem(ae,16,"<div class='itemtype-"+E(ae.type)+"'>{icon} {name}</div>")}}else{if(this.options.displayMode=="list"){this.widgets.currentValuesDataTable.addRow(ae)}}}}}if(this.options.displayMode=="items"){L.get(this.id+"-currentValueDisplay").innerHTML=Z}}this._enableActions()}},onSelectedItemAdded:function l(aa,Y){if(p(this,Y)){var ac=Y[1];if(ac&&ac.item){var X=this.widgets.dataTable.getRecordSet().getRecords(),Z=0,W=X.length;for(;Z<W;Z++){if(ac.item.nodeRef==X[Z].getData().nodeRef){break}}if(Z==W){this.widgets.dataTable.addRow(ac.item);this.selectedItems[ac.item.nodeRef]=ac.item;this.singleSelectedItem=ac.item;if(ac.highlight){var ab=this.widgets.dataTable.get("element");ab.scrollTop=ab.scrollHeight;Alfresco.util.Anim.pulse(this.widgets.dataTable.getLastTrEl())}}else{Alfresco.util.PopupManager.displayMessage({text:this.msg("message.item-already-added",E(ac.item.name))})}}}},onSelectedItemRemoved:function Q(X,W){if(p(this,W)){var Y=W[1];if(Y&&Y.item){delete this.selectedItems[Y.item.nodeRef];this.singleSelectedItem=null}}},onParentChanged:function d(X,W){if(p(this,W)){var Y=W[1];if(Y&&Y.label){this.widgets.navigationMenu.set("label",'<div><span class="item-icon"><img src="'+Alfresco.constants.URL_RESCONTEXT+'components/form/images/ajax_anim.gif" width="16" height="16" alt="'+this.msg("message.please-wait")+'"></span><span class="item-name">'+E(Y.label)+"</span></div>")}}},onParentDetails:function m(aa,ad){if(p(this,ad)){var Z=ad[1];if(Z&&Z.parent){var af=[],ah=Z.parent,ae=this.widgets.navigationMenu,ac=ae.getMenu(),ab=ac.getItemGroups()[0],X="";while(ah){af=[ah].concat(af);ah=ah.parent}var Y,ag;for(Y=0,ag=ab.length;Y<ag;Y++){ac.removeItem(0,0,true)}ah=af[af.length-1];ae.set("label",this.options.objectRenderer.renderItem(ah,16,'<div><span class="item-icon">{icon}</span><span class="item-name">{name}</span></div>'));if(af.length>1){this.widgets.folderUp.set("value",af[af.length-2]);this.widgets.folderUp.set("disabled",false)}else{this.widgets.folderUp.set("disabled",true)}var W;for(Y=0,ag=af.length;Y<ag;Y++){ah=af[Y];W=new YAHOO.widget.MenuItem(this.options.objectRenderer.renderItem(ah,16,X+'<span class="item-icon">{icon}</span><span class="item-name">{name}</span>'),{value:ah.nodeRef});W.cfg.addProperty("label",{value:ah.name});ac.addItem(W,0);X+="&nbsp;&nbsp;&nbsp;"}ac.render()}}},onFormContainerDestroyed:function v(X,W){if(this.widgets.dialog){this.widgets.dialog.destroy();delete this.widgets.dialog}if(this.widgets.resizer){this.widgets.resizer.destroy();delete this.widgets.resizer}},onRemoveListItem:function b(X,W){if(p(this,W)){var Y=W[1].value,Z=W[1].rowId;this.widgets.currentValuesDataTable.deleteRow(Z);delete this.selectedItems[Y.nodeRef];this.singleSelectedItem=null;this._adjustCurrentValues()}},fnRenderCellIcon:function F(){var X=this;return function W(aa,Z,ab,ac){var Y=X.options.compactMode?16:32;ab.width=Y-6;L.setStyle(aa.parentNode,"width",ab.width+"px");aa.innerHTML=X.options.objectRenderer.renderItem(Z.getData(),Y,'<div class="icon'+Y+'">{icon}</div>')}},fnRenderCellGenericIcon:function P(){var X=this;return function W(aa,Z,ab,ac){Alfresco.logger.debug("ObjectFinder_renderCellGenericIcon("+aa+", "+Z+", "+ab.width+", "+ac+")");var Y=X.options.compactMode?16:32;if(ab.width){Alfresco.logger.debug("ObjectFinder_renderCellGenericIcon setting width!");L.setStyle(aa,"width",ab.width+(YAHOO.lang.isNumber(ab.width)?"px":""));L.setStyle(aa.parentNode,"width",ab.width+(YAHOO.lang.isNumber(ab.width)?"px":""))}aa.innerHTML=X.options.objectRenderer.renderItem(Z.getData(),Y,'<div class="icon'+Y+'">{icon}</div>')}},fnRenderCellName:function J(){var X=this;return function W(aa,Z,ab,ac){var Y;if(X.options.compactMode){Y='<h3 class="name">{name}</h3>'}else{Y='<h3 class="name">{name}</h3><div class="description">{description}</div>'}aa.innerHTML=X.options.objectRenderer.renderItem(Z.getData(),0,Y)}},fnRenderCellRemove:function z(){var X=this;return function W(Z,Y,aa,ab){L.setStyle(Z.parentNode,"width",aa.width+"px");Z.innerHTML='<a href="#" class="remove-item remove-'+X.eventGroup+'" title="'+X.msg("form.control.object-picker.remove-item")+'" tabindex="0"><span class="removeIcon">&nbsp;</span></a>'}},fnRenderCellListItemName:function N(){var X=this;return function W(ae,ai,ab,aa){var ah=ai.getData(),ag=ah.description?E(ah.description):X.msg("label.none"),Z=ah.modified?Alfresco.util.formatDate(Alfresco.util.fromISO8601(ah.modified)):null,ad=E(ah.name);if(X.options.showLinkToTarget&&X.options.targetLinkTemplate!==null){var ac;if(YAHOO.lang.isFunction(X.options.targetLinkTemplate)){ac=X.options.targetLinkTemplate.call(X,ai.getData())}else{var Y=(ah.site)?Alfresco.constants.URL_PAGECONTEXT+"site/{site}/document-details?nodeRef={nodeRef}":Alfresco.constants.URL_PAGECONTEXT+"document-details?nodeRef={nodeRef}";ac=YAHOO.lang.substitute(Y,{nodeRef:ah.nodeRef,site:ah.site})}ad='<a href="'+ac+'">'+E(ah.name)+"</a>"}var af='<h3 class="name">'+ad+"</h3>";af+='<div class="description">'+X.msg("form.control.object-picker.description")+": "+ag+"</div>";af+='<div class="viewmode-label">'+X.msg("form.control.object-picker.modified-on")+": "+(Z?Z:X.msg("label.none"))+"</div>";ae.innerHTML=af}},fnRenderCellListItemActions:function V(){var W=this;return function X(ae,ag,ab,Y){if(ab.width){L.setStyle(ae,"width",ab.width+(YAHOO.lang.isNumber(ab.width)?"px":""));L.setStyle(ae.parentNode,"width",ab.width+(YAHOO.lang.isNumber(ab.width)?"px":""))}if(W.options.disabled===false){var af="",ac,Z;for(var aa=0,ad=W.options.listItemActions.length;aa<ad;aa++){Z=W.options.listItemActions[aa];if(Z.event){af+='<div class="list-action"><a href="#" class="'+Z.name+"  list-action-event-"+W.eventGroup+" "+Z.event+'" title="'+W.msg(Z.label)+'" tabindex="0">'+W.msg(Z.label)+"</a></div>"}else{ac=null;if(YAHOO.lang.isFunction(Z.link)){ac=Z.link.call(this,ag.getData())}else{if(YAHOO.lang.isString(Z.link)){ac=YAHOO.lang.substitute(Z.link,ag.getData())}}af+='<div class="list-action"><a href="'+ac+'" class="'+Z.name+'" title="'+W.msg(Z.label)+'" tabindex="0">'+W.msg(Z.label)+"</a></div>"}}ae.innerHTML=af}}},_loadSelectedItems:function e(X){var aa="";if(this.options.selectedValue){aa=this.options.selectedValue}else{aa=this.options.currentValue}var ab=function Z(ae){var ad=ae.json.data.items,ag;this.selectedItems={};for(var af=0,ac=ad.length;af<ac;af++){ag=ad[af];this.selectedItems[ag.nodeRef]=ag}YAHOO.Bubbling.fire("renderCurrentValue",{eventGroup:this})};var Y=function W(ac){this.selectedItems=null};if(aa!==""){Alfresco.util.Ajax.jsonRequest({url:Alfresco.constants.PROXY_URI+"api/forms/picker/items",method:"POST",dataObj:{items:aa.split(","),itemValueType:this.options.valueType},successCallback:{fn:ab,scope:this},failureCallback:{fn:Y,scope:this}})}else{if(this.options.disabled&&this.options.displayMode=="items"){L.get(this.id+"-currentValueDisplay").innerHTML=this.msg("form.control.novalue")}this._enableActions()}},_createNavigationControls:function y(){var X=this;if(this._inAuthorityMode()){L.setStyle(this.pickerId+"-folderUpContainer","display","none");L.setStyle(this.pickerId+"-navigatorContainer","display","none");L.setStyle(this.pickerId+"-searchContainer","display","block");this.widgets.searchButton=new YAHOO.widget.Button(this.pickerId+"-searchButton");this.widgets.searchButton.on("click",this.onSearch,this.widgets.searchButton,this);L.get(this.pickerId+"-searchButton").name="-";var W=L.get(this.pickerId+"-searchText");new YAHOO.util.KeyListener(W,{keys:13},{fn:X.onSearch,scope:this,correctScope:true},"keydown").enable()}else{this.widgets.folderUp=new YAHOO.widget.Button(this.pickerId+"-folderUp",{disabled:true});this.widgets.folderUp.on("click",this.onFolderUp,this.widgets.folderUp,this);this.widgets.navigationMenu=new YAHOO.widget.Button(this.pickerId+"-navigator",{type:"menu",menu:this.pickerId+"-navigatorMenu",lazyloadmenu:false});L.get(this.pickerId+"-folderUp-button").name="-";L.get(this.pickerId+"-navigator-button").name="-";this.widgets.navigationMenu.getMenu().subscribe("click",function(Z,Y){var aa=Y[1];if(aa){YAHOO.Bubbling.fire("parentChanged",{eventGroup:X,label:aa.cfg.getProperty("label"),nodeRef:aa.value})}});if(L.get(this.pickerId+"-createNew")){this.widgets.createNewOK=new YAHOO.widget.Button(this.pickerId+"-createNewOK",{disabled:true});this.widgets.createNewOK.on("click",this.onCreateNewOK,this.widgets.createNewOK,this);this.widgets.createNewCancel=new YAHOO.widget.Button(this.pickerId+"-createNewCancel",{disabled:true});this.widgets.createNewCancel.on("click",this.onCreateNewCancel,this.widgets.createNewCancel,this)}}},_createSelectedItemsControls:function n(){var X=function ah(ao,al){var ak=al;if(al&&al.length>0){var aj=al.data.items;var am,an;for(am in aj){if(aj.hasOwnProperty(am)){an=aj[am];if(an.type=="cm:category"&&an.displayPath.indexOf("/categories/Tags")!==-1){an.type="tag"}}}ak={items:aj}}return ak};var ae=this;if(this.options.disabled===false){this.widgets.dataSource=new YAHOO.util.DataSource([],{responseType:YAHOO.util.DataSource.TYPE_JSARRAY,doBeforeParseData:X});var ac=[{key:"nodeRef",label:"Icon",sortable:false,formatter:this.fnRenderCellIcon(),width:this.options.compactMode?10:26},{key:"name",label:"Item",sortable:false,formatter:this.fnRenderCellName()},{key:"remove",label:"Remove",sortable:false,formatter:this.fnRenderCellRemove(),width:16}];this.widgets.dataTable=new YAHOO.widget.DataTable(this.pickerId+"-selectedItems",ac,this.widgets.dataSource,{MSG_EMPTY:this.msg("form.control.object-picker.selected-items.empty")});var ad=function W(am,al){var aj=YAHOO.Bubbling.getOwnerByTagName(al[1].anchor,"div");if(aj!==null){var ao,an,ak;ao=al[1].target;an=ao.offsetParent;ak=ae.widgets.dataTable.getRecord(an);if(ak){ae.widgets.dataTable.deleteRow(an);YAHOO.Bubbling.fire("selectedItemRemoved",{eventGroup:ae,item:ak.getData()})}}return true};YAHOO.Bubbling.addDefaultAction("remove-"+this.eventGroup,ad,true)}var aa=L.get(this.id+"-currentValueDisplay");L.addClass(aa,"object-finder-"+this.options.displayMode);if(this.options.displayMode=="list"){var Y=new YAHOO.util.DataSource([],{responseType:YAHOO.util.DataSource.TYPE_JSARRAY,doBeforeParseData:X});var af=[{key:"nodeRef",label:"Icon",sortable:false,formatter:this.fnRenderCellGenericIcon(),width:50},{key:"name",label:"Item",sortable:false,formatter:this.fnRenderCellListItemName()},{key:"action",label:"Actions",sortable:false,formatter:this.fnRenderCellListItemActions(),width:200}];var Z=this.id+"-currentValueDisplay";aa=L.get(Z);if(aa.tagName.toLowerCase()=="span"){var ai=document.createElement("div");ai.setAttribute("class",aa.getAttribute("class"));aa.parentNode.appendChild(ai);aa.parentNode.removeChild(aa);aa=ai}this.widgets.currentValuesDataTable=new YAHOO.widget.DataTable(aa,af,Y,{MSG_EMPTY:this.msg("form.control.object-picker.selected-items.empty")});this.widgets.currentValuesDataTable.subscribe("rowMouseoverEvent",this.widgets.currentValuesDataTable.onEventHighlightRow);this.widgets.currentValuesDataTable.subscribe("rowMouseoutEvent",this.widgets.currentValuesDataTable.onEventUnhighlightRow);L.addClass(aa,"form-element-border");L.addClass(aa,"form-element-background-color");var ag=function ab(ap,ar){var ak=YAHOO.Bubbling.getOwnerByTagName(ar[1].anchor,"div");if(ak!==null){var aq,al,ao;aq=ar[1].target;al=aq.offsetParent;ao=ae.widgets.currentValuesDataTable.getRecord(al);if(ao){var an=ao.getData(),aj=YAHOO.util.Dom.getAttribute(ar[1].target,"class").split(" ")[0];for(var am=0,at=ae.options.listItemActions.length;am<at;am++){if(ae.options.listItemActions[am].name==aj){YAHOO.Bubbling.fire(ae.options.listItemActions[am].event,{eventGroup:ae,value:an,rowId:al});return true}}}}return true};YAHOO.Bubbling.addDefaultAction("list-action-event-"+this.eventGroup,ag,true)}},_populateSelectedItems:function D(){this.widgets.dataTable.set("MSG_EMPTY",this.msg("form.control.object-picker.selected-items.empty"));this.widgets.dataTable.deleteRows(0,this.widgets.dataTable.getRecordSet().getLength());for(var W in this.selectedItems){if(this.selectedItems.hasOwnProperty(W)){YAHOO.Bubbling.fire("selectedItemAdded",{eventGroup:this,item:this.selectedItems[W]})}}},_resolveStartLocation:function i(){if(this.options.startLocation||this.options.rootNode){this.options.startLocation=(this.options.startLocation||this.options.rootNode);if(Alfresco.logger.isDebugEnabled()){Alfresco.logger.debug("Resolving startLocation of '"+this.options.startLocation+"'")}var W=null;if(this.options.startLocation.charAt(0)=="{"){if(this.options.startLocation=="{companyhome}"){W="alfresco://company/home"}else{if(this.options.startLocation=="{userhome}"){W="alfresco://user/home"}else{if(this.options.startLocation=="{siteshome}"){W="alfresco://sites/home"}else{if(this.options.startLocation=="{self}"){if(this.options.currentItem&&this.options.currentItem!==null){W=this.options.currentItem}else{W="alfresco://company/home";if(Alfresco.logger.isDebugEnabled()){Alfresco.logger.warn("To use a start location of {self} a 'currentItem' parameter is required, defaulting to company home")}}}}}}}else{if(this.options.startLocation.charAt(0)=="/"){W=""}else{W=this.options.startLocation}}if(W!=null){this.options.objectRenderer.options.parentNodeRef=W;this._fireRefreshEvent()}else{this._locateStartingNode()}}else{this._fireRefreshEvent()}},_locateStartingNode:function H(){if(this.options.startLocation&&this.options.currentItem&&this.options.currentItem!==null){var aa="companyhome";if(this.options.startLocation=="{parent}"){aa="ancestor"}else{if(this.options.startLocation.length>2&&this.options.startLocation.charAt(0)=="{"&&this.options.startLocation.charAt(this.options.startLocation.length-1)=="}"){aa=this.options.startLocation.substring(1,this.options.startLocation.length-1)}}var Y=A(Alfresco.constants.PROXY_URI,"/api/",this.options.currentItem.replace("://","/"),"nodelocator",aa);if(this.options.startLocationParams&&this.options.startLocationParams!=null){Y+="?"+encodeURI(this.options.startLocationParams)}var X=function ab(ad){var ae=ad.json.data.nodeRef;if(Alfresco.logger.isDebugEnabled()){Alfresco.logger.debug("startLocation resolved to: "+ae)}this.options.objectRenderer.options.parentNodeRef=ae;this._fireRefreshEvent()};var Z=function ac(ad){if(Alfresco.logger.isDebugEnabled()){Alfresco.logger.error("Failed to locate node: "+ad.serverResponse.responseText)}this._fireRefreshEvent()};if(Alfresco.logger.isDebugEnabled()){Alfresco.logger.debug("Generated nodelocator url: "+Y)}var W={method:"GET",url:Y,successCallback:{fn:X,scope:this},failureCallback:{fn:Z,scope:this}};Alfresco.util.Ajax.request(W)}else{if(Alfresco.logger.isDebugEnabled()){Alfresco.logger.warn("To use a start location of "+this.options.startLocation+" a 'currentItem' parameter is required")}this._fireRefreshEvent()}},_fireRefreshEvent:function o(){if(this._inAuthorityMode()===false){YAHOO.Bubbling.fire("refreshItemList",{eventGroup:this})}else{var X=L.get(this.pickerId+"-searchText");var W=X.value;if(W.length>=this.options.minSearchTermLength){YAHOO.Bubbling.fire("refreshItemList",{eventGroup:this,searchTerm:W})}else{X.focus()}}},_createResizer:function U(){if(!this.widgets.resizer){var W=parseInt(L.get(this.pickerId+"-body").offsetWidth,10)-2,X=0;this.columns[0]=L.get(this.pickerId+"-left");this.columns[1]=L.get(this.pickerId+"-right");this.widgets.resizer=new YAHOO.util.Resize(this.pickerId+"-left",{handles:["r"],minWidth:200,maxWidth:(W-200)});X=this.widgets.resizer.get("height");this.widgets.resizer.on("resize",function(Z){var Y=Z.width;L.setStyle(this.columns[0],"height","");L.setStyle(this.columns[1],"width",(W-Y-8)+"px")},this,true);this.widgets.resizer.on("endResize",function(Y){this.set("height",X)});this.widgets.resizer.fireEvent("resize",{ev:"resize",target:this.widgets.resizer,width:W/2})}},_inAuthorityMode:function u(){return(this.options.itemFamily=="authority")},_enableActions:function g(){if(this.widgets.removeAllButton){this.widgets.removeAllButton.set("disabled",this.widgets.currentValuesDataTable.getRecordSet().getLength()===0)}if(this.widgets.addButton){this.widgets.addButton.set("disabled",false)}if(!this.options.disabled&&!this.isReady){this.isReady=true;YAHOO.Bubbling.fire("objectFinderReady",{eventGroup:this})}}})})();(function(){var c=YAHOO.util.Dom,x=YAHOO.util.Event,l=YAHOO.util.KeyListener;var n=Alfresco.util.encodeHTML,t=Alfresco.util.hasEventInterest,k=Alfresco.util.combinePaths;var h="~CREATE~NEW~";Alfresco.ObjectRenderer=function(y){this.objectFinder=y;Alfresco.ObjectRenderer.superclass.constructor.call(this,"Alfresco.ObjectRenderer",y.pickerId,["button","menu","container","datasource","datatable"]);this.eventGroup=y.eventGroup;YAHOO.Bubbling.on("refreshItemList",this.onRefreshItemList,this);YAHOO.Bubbling.on("parentChanged",this.onParentChanged,this);YAHOO.Bubbling.on("selectedItemAdded",this.onSelectedItemChanged,this);YAHOO.Bubbling.on("selectedItemRemoved",this.onSelectedItemChanged,this);this.addItemButtons={};this.startLocationResolved=false;this.createNewItemId=null;return this};YAHOO.extend(Alfresco.ObjectRenderer,Alfresco.component.Base,{options:{parentNodeRef:"",itemType:"cm:content",itemFamily:"node",params:"",compactMode:false,maxSearchResults:100,createNewItemUri:"",createNewItemIcon:""},addItemButtons:null,createNewItemId:null,startLocationResolved:false,onReady:function m(){this._createControls()},destroy:function u(){try{YAHOO.Bubbling.unsubscribe("refreshItemList",this.onRefreshItemList,this);YAHOO.Bubbling.unsubscribe("parentChanged",this.onParentChanged,this);YAHOO.Bubbling.unsubscribe("selectedItemAdded",this.onSelectedItemChanged,this);YAHOO.Bubbling.unsubscribe("selectedItemRemoved",this.onSelectedItemChanged,this)}catch(y){}Alfresco.ObjectRenderer.superclass.destroy.call(this)},onPickerShow:function q(){this.addItemButtons={};c.get(this.objectFinder.pickerId).focus()},getIconURL:function f(z,y){return Alfresco.constants.URL_RESCONTEXT+"components/images/filetypes/"+Alfresco.util.getFileIcon(z.name,z.type,y)},renderItem:function b(D,y,B){var C=this;var A=function z(E,G,F){if(E.toLowerCase()=="icon"){return'<img src="'+C.getIconURL(D,y)+'" width="'+y+'" alt="'+n(D.description)+'" title="'+n(D.name)+'" />'}return n(G)};return YAHOO.lang.substitute(B,D,A)},onRefreshItemList:function v(A,z){if(t(this,z)){var y="";var B=z[1];if(B&&B.searchTerm){y=B.searchTerm}this._updateItems(this.options.parentNodeRef,y)}},onParentChanged:function o(z,y){if(t(this,y)){var A=y[1];if(A&&A.nodeRef){this._updateItems(A.nodeRef,"")}}},onSelectedItemChanged:function r(A,y){if(t(this,y)){var B=y[1];if(B&&B.item){var z;for(var C in this.addItemButtons){if(this.addItemButtons.hasOwnProperty(C)){z=this.addItemButtons[C];c.setStyle(z,"display",this.objectFinder.canItemBeSelected(C)?"inline":"none")}}}}},fnRenderItemIcon:function e(){var y=this;return function z(C,B,E,F){var A=y.options.compactMode?16:32;E.width=A-6;c.setStyle(C.parentNode,"width",E.width+"px");if(B.getData("type")==h){c.addClass(this.getTrEl(C),"create-new-row");var D={type:y.options.createNewItemIcon,description:y.msg("form.control.object-picker.create-new")};C.innerHTML=y.renderItem(D,A,'<div class="icon'+A+'"><span class="new-item-overlay"></span>{icon}</div>');return}C.innerHTML=y.renderItem(B.getData(),A,'<div class="icon'+A+'">{icon}</div>')}},fnRenderItemName:function g(){var z=this;return function y(C,B,D,E){var A="";if(B.getData("type")==h){z.createNewItemId=Alfresco.util.generateDomId();C.innerHTML='<input id="'+z.createNewItemId+'" type="text" class="create-new-input" tabindex="0" />';return}if(B.getData("isContainer")||(!B.getData("isContainer")&&(z.options.allowNavigationToContentChildren||B.getData("type")=="cm:category"))){A+='<h3 class="item-name"><a href="#" class="theme-color-1 parent-'+z.eventGroup+'">{name}</a></h3>'}else{A+='<h3 class="item-name">{name}</h3>'}if(!z.options.compactMode){A+='<div class="description">{description}</div>'}C.innerHTML=z.renderItem(B.getData(),0,A)}},fnRenderCellAdd:function w(){var y=this;return function z(F,E,G,H){c.setStyle(F.parentNode,"width",G.width+"px");var A=Alfresco.util.generateDomId(),B;if(E.getData("type")==h){F.innerHTML='<a href="#" class="create-new-item create-new-item-'+y.eventGroup+'" title="'+y.msg("form.control.object-picker.create-new")+'" tabindex="0"><span class="createNewIcon">&nbsp;</span></a>';return}if(E.getData("selectable")){var D=E.getData("nodeRef"),C="";if(!y.objectFinder.canItemBeSelected(D)){C='style="display: none"'}F.innerHTML='<a id="'+A+'" href="#" '+C+' class="add-item add-'+y.eventGroup+'" title="'+y.msg("form.control.object-picker.add-item")+'" tabindex="0"><span class="addIcon">&nbsp;</span></a>';y.addItemButtons[D]=A}}},onCreateNewItem:function d(){var y=c.get(this.createNewItemId),z=k("/",this.options.createNewItemUri).substring(1),B;if(y){B=y.value;if(B===null||B.length<1){return}Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI+z,dataObj:{name:B},successCallback:{fn:function A(E){var C=E.json;if(C&&C.nodeRef){var D={type:this.options.itemType,name:C.name,nodeRef:C.nodeRef,selectable:true};if(D.type=="cm:category"&&C.displayPath.indexOf("/categories/Tags")!==-1){D.type="tag"}if(!C.itemExists){Alfresco.util.PopupManager.displayMessage({text:this.msg("form.control.object-picker.create-new.success",C.name)});this.widgets.dataTable.addRow(D)}YAHOO.Bubbling.fire("selectedItemAdded",{eventGroup:this,item:D,highlight:true})}y.value=""},scope:this},failureMessage:this.msg("form.control.object-picker.create-new.failure")})}},_createControls:function j(){var E=this;var H=Alfresco.constants.PROXY_URI+"api/forms/picker/"+this.options.itemFamily;this.widgets.dataSource=new YAHOO.util.DataSource(H,{responseType:YAHOO.util.DataSource.TYPE_JSON,connXhrMode:"queueRequests",responseSchema:{resultsList:"items",metaFields:{parent:"parent"}}});this.widgets.dataSource.doBeforeParseData=function G(O,L){var K=L;if(L){var J=L.data.items;if(E.options.maxSearchResults>-1&&J.length>E.options.maxSearchResults){J=J.slice(0,E.options.maxSearchResults-1)}if(E.options.createNewItemUri!==""&&E.createNewItemId===null){J=[{type:h}].concat(J)}var M,N;for(M in J){if(J.hasOwnProperty(M)){N=J[M];if(N.type=="cm:category"&&N.displayPath.indexOf("/categories/Tags")!==-1){N.type="tag";L.data.parent.type="tag"}}}YAHOO.Bubbling.fire("parentDetails",{eventGroup:E,parent:L.data.parent});K={parent:L.data.parent,items:J}}return K};var D=[{key:"nodeRef",label:"Icon",sortable:false,formatter:this.fnRenderItemIcon(),width:this.options.compactMode?10:26},{key:"name",label:"Item",sortable:false,formatter:this.fnRenderItemName()},{key:"add",label:"Add",sortable:false,formatter:this.fnRenderCellAdd(),width:16}];var C=this.msg("form.control.object-picker.items-list.loading");if(this._inAuthorityMode()){C=this.msg("form.control.object-picker.items-list.search")}this.widgets.dataTable=new YAHOO.widget.DataTable(this.id+"-results",D,this.widgets.dataSource,{renderLoopSize:100,initialLoad:false,MSG_EMPTY:C});this.widgets.dataTable.subscribe("renderEvent",function(){if(this.options.createNewItemUri!==""){if(!this.widgets.enterListener){this.widgets.enterListener=new l(this.createNewItemId,{keys:l.KEY.ENTER},{fn:function J(K,L,M){if(this.autocompleteDelayId!=-1){window.clearTimeout(this.autocompleteDelayId)}this.onCreateNewItem();x.stopEvent(L[1]);return false},scope:this,correctScope:true},YAHOO.env.ua.ie>0?l.KEYDOWN:"keypress");this.widgets.enterListener.enable()}E.autocompleteDelayId=-1;x.addListener(this.createNewItemId,"keyup",function(K){var L=this.value;if(!Alfresco.util.isAutocompleteIgnoreKey(K.keyCode)){if(E.autocompleteDelayId!=-1){window.clearTimeout(E.autocompleteDelayId)}E.autocompleteDelayId=window.setTimeout(function(){YAHOO.Bubbling.fire("refreshItemList",{eventGroup:E,searchTerm:L})},500)}});c.get(this.createNewItemId).focus()}},this,true);var y=function A(M,L){var J=YAHOO.Bubbling.getOwnerByTagName(L[1].anchor,"div");if(J!==null){var O,N,K;O=L[1].target;N=O.offsetParent;K=E.widgets.dataTable.getRecord(N);if(K){YAHOO.Bubbling.fire("selectedItemAdded",{eventGroup:E,item:K.getData(),highlight:true})}}return true};YAHOO.Bubbling.addDefaultAction("add-"+this.eventGroup,y,true);var z=function F(L,K){var J=YAHOO.Bubbling.getOwnerByTagName(K[1].anchor,"div");if(J!==null){E.onCreateNewItem()}return true};YAHOO.Bubbling.addDefaultAction("create-new-item-"+this.eventGroup,z,true);var I=function B(M,L){var J=YAHOO.Bubbling.getOwnerByTagName(L[1].anchor,"div");if(J!==null){var O,N,K;O=L[1].target;N=O.offsetParent;K=E.widgets.dataTable.getRecord(N);if(K){YAHOO.Bubbling.fire("parentChanged",{eventGroup:E,label:K.getData("name"),nodeRef:K.getData("nodeRef")})}}return true};YAHOO.Bubbling.addDefaultAction("parent-"+this.eventGroup,I,true)},_updateItems:function s(E,y){if(this.createNewItemId!==null){this.widgets.dataTable.deleteRows(1,this.widgets.dataTable.getRecordSet().getLength()-1)}else{this.widgets.dataTable.set("MSG_EMPTY",this.msg("form.control.object-picker.items-list.loading"));this.widgets.dataTable.deleteRows(0,this.widgets.dataTable.getRecordSet().getLength())}var B=function A(F,G,H){this.options.parentNodeRef=G.meta.parent?G.meta.parent.nodeRef:E;this.widgets.dataTable.set("MSG_EMPTY",this.msg("form.control.object-picker.items-list.empty"));if(this.createNewItemId!==null){this.widgets.dataTable.onDataReturnAppendRows.call(this.widgets.dataTable,F,G,H)}else{this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable,F,G,H)}};var D=function C(G,H){if(H.status==401){window.location.reload()}else{try{var F=YAHOO.lang.JSON.parse(H.responseText);this.widgets.dataTable.set("MSG_ERROR",F.message);this.widgets.dataTable.showTableMessage(F.message,YAHOO.widget.DataTable.CLASS_ERROR)}catch(I){}}};var z=this._generatePickerChildrenUrlPath(E)+this._generatePickerChildrenUrlParams(y);if(Alfresco.logger.isDebugEnabled()){Alfresco.logger.debug("Generated pickerchildren url fragment: "+z)}this.widgets.dataSource.sendRequest(z,{success:B,failure:D,scope:this});this.startLocationResolved=true},_inAuthorityMode:function i(){return(this.options.itemFamily=="authority")},_generatePickerChildrenUrlPath:function p(y){return k("/",y.replace("://","/"),"children")},_generatePickerChildrenUrlParams:function a(z){var A="?selectableType="+this.options.itemType+"&searchTerm="+encodeURIComponent(z)+"&size="+this.options.maxSearchResults;if(!this.startLocationResolved&&this.options.startLocation&&this.options.startLocation.charAt(0)=="/"){A+="&xpath="+encodeURIComponent(this.options.startLocation)}if(this.options.rootNode){var y=null;if(this.options.rootNode.charAt(0)=="{"){if(this.options.rootNode=="{companyhome}"){y="alfresco://company/home"}else{if(this.options.rootNode=="{userhome}"){y="alfresco://user/home"}else{if(this.options.rootNode=="{siteshome}"){y="alfresco://sites/home"}}}}else{y=this.options.rootNode}if(y!==null){A+="&rootNode="+encodeURIComponent(y)}}if(this.options.params){A+="&"+encodeURI(this.options.params)}return A}})})();