/**
 * IDEALIAGroup srl
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the EULA
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.idealiagroup.com/magento-ext-license.html
 *
 * @category   IG
 * @package    IG_Forms
 * @copyright  Copyright (c) 2010-2011 IDEALIAGroup srl (http://www.idealiagroup.com)
 * @license    http://www.idealiagroup.com/magento-ext-license.html
 */

var igForm = {
	formSent: false,
	
	onSubmit: function (formId) {
		this.formSent = true;
		var overlayId = formId+'_overlay';
		var wrapperId = formId+'_wrapper';
		
		if (!$(overlayId))
			$(document.body).insert('<div class="ig-forms-form-overlay" id="'+overlayId+'"></div>');
		
		$(overlayId).setStyle({
			display: 'block',
			width: $(wrapperId).getWidth()+'px',
			height: $(wrapperId).getHeight()+'px',
			left: $(wrapperId).cumulativeOffset()[0]+'px',
			top: $(wrapperId).cumulativeOffset()[1]+'px'
		});
	},
	
	onSuccess: function (formId) {
		var wrapperId = 'ig_forms_'+formId+'_wrapper';
		var overlayId = 'ig_forms_'+formId+'_overlay';
		
		$(wrapperId).setStyle({ display: 'none' });
		$(overlayId).setStyle({ display: 'none' });
	},
	
	showBackToForm: function (formId) {
		var backToFormId = 'ig_forms_'+formId+'_back';
		
		$(backToFormId).setStyle({ display: 'block' });
	},
	
	showForm: function (formId) {
		var backToFormId = 'ig_forms_'+formId+'_back';
		var wrapperId = 'ig_forms_'+formId+'_wrapper';
		var resultsId = 'ig_forms_'+formId+'_results';
		
		$(backToFormId).setStyle({ display: 'none' });
		$(resultsId).setStyle({ display: 'none' });
		$(wrapperId).setStyle({ display: 'block' });
	},
	
	formReset: function (formId) {
		$('ig_forms_'+formId).reset();
	},
	
	onResponseLoaded: function (formId) {
		if (this.formSent)
		{
			if ($('recaptcha_widget_div')) Recaptcha.reload();
			
			var overlayId = formId+'_overlay';
			var frameId = formId+'_frame';
			var resultsId = formId+'_results';
			
			$(overlayId).setStyle({ display: 'none' });
			
		    var content = $(frameId).contentWindow.document.body.innerHTML;
			$(resultsId).innerHTML = content;
			$(resultsId).setStyle({display: 'block'});
		}
		
		this.formSent = false;
	}
}

var igFormsTooltip = Class.create({
	initialize: function(element) {
		this._element = element;
		this.addObservers();
		this.setup();
	},
	
	setup: function() {
		var tooltipId = this._element.id.replace('_wrapper', '_tooltip');
		this._tooltip = $(tooltipId);
	},
	
	addObservers: function() {
		Event.observe(this._element, "mouseover", this.show.bind(this));
   		Event.observe(this._element, "mouseout", this.hide.bind(this));
    	Event.observe(this._element, "mousemove", this.move.bindAsEventListener(this));
	},
	
	show: function() {
		if (!this._tooltip) return;
		this._tooltip.setStyle({display: 'block'});
	},
	
	hide: function() {
		if (!this._tooltip) return;
		this._tooltip.setStyle({display: 'none'});
	},
	
	move: function(event){
		if (!this._tooltip) return;
		this.mouseX = Event.pointerX(event);
		this.mouseY = Event.pointerY(event);
		
		this._tooltip.setStyle({ top:this.mouseY + 20 + "px", left:this.mouseX + 15 + "px" });
	}
});

document.observe("dom:loaded", function() {
	$$('.ig-forms-field').each(function (field) { new igFormsTooltip(field); });
});