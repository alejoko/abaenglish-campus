(function($){
	$.fn.tipTip = function(options) {
		var defaults = { 
			activation: "hover",
			keepAlive: false,
			maxWidth: "200px",
			edgeOffset: 3,
			defaultPosition: "top",
			delay: 400,
			attribute: "title",
			locateParams: null,
			content: false, // HTML or String to fill TipTIp with
			idHolder: "tiptip_holder",
			idContent: "tiptip_content",
			$gadget: $("body"),
		  	enter: function(){},
		  	exit: function(){}
	  	};
	 	var opts = $.extend(defaults, options);
	 	
	 	// Setup tip tip elements and render them to the DOM
	 	if($("#"+opts.idHolder).length <= 0){
	 		var tiptip_holder = $('<div id="'+opts.idHolder+'" style="max-width:'+ opts.maxWidth +';"></div>');
	 		var tiptip_content = $('<div id="'+opts.idContent+'"></div>'); //id="'+opts.idContent+'"
			opts.$gadget.append(tiptip_holder.html(tiptip_content));
		} else {
			var tiptip_holder = $("#"+opts.idHolder);
			var tiptip_content = $("#"+opts.idContent);
		}
		
		return this.each(function(){
			var org_elem = $(this);
			
			if(opts.content){
				var org_title = opts.content;
			} else {
				var org_title = org_elem.attr(opts.attribute);
			}
			
			if(org_title != ""){
				if(!opts.content){
					org_elem.removeAttr(opts.attribute); //remove original Attribute
				}
				
				var timeout = false;

					opts.enter.call(this);
				
					tiptip_content.html(org_title);
					console.log(tiptip_content);
					tiptip_holder.hide().removeAttr("class").css("margin","0");
					
					var top = parseInt(org_elem.offset()['top']);
					var left = parseInt(org_elem.offset()['left']);
					var org_width = parseInt(org_elem.outerWidth());
					var org_height = parseInt(org_elem.outerHeight());
					var tip_w = tiptip_holder.outerWidth();
					var tip_h = tiptip_holder.outerHeight();
					var w_compare = Math.round((org_width - tip_w) / 2);
					var h_compare = Math.round((org_height - tip_h) / 2);
					var marg_left = Math.round(left + w_compare);
					var marg_top = Math.round(top + org_height + opts.edgeOffset);
					var t_class = "";
					var arrow_left = Math.round(tip_w - 12) / 2;
								
					// load params
					if (opts.locateParams!=null) {
						$.each(opts.locateParams, function(index,item){
							tiptip_holder.attr(item.attr,item.value);
						});
					}
					
					t_class = "_top";
               
					var top_compare = (top + org_height + opts.edgeOffset + tip_h + 8) > parseInt($(window).height() + $(window).scrollTop());
					var bottom_compare = ((top + org_height) - (opts.edgeOffset + tip_h + 8)) < 0;
					
					if(top_compare || (t_class == "_bottom" && top_compare) || (t_class == "_top" && !bottom_compare)){
						if(t_class == "_top" || t_class == "_bottom"){
							t_class = "_top";
						} else {
							t_class = t_class+"_top";
						}
						marg_top = Math.round(top - (tip_h  + 5 + opts.edgeOffset));
						
					}
				
					if(t_class == "_right_top" || t_class == "_left_top"){
						marg_top = marg_top + 5;
					} else if(t_class == "_right_bottom" || t_class == "_left_bottom"){		
						marg_top = marg_top - 5;
					}
					if(t_class == "_left_top" || t_class == "_left_bottom"){	
						marg_left = marg_left + 5;
					}
					
					tiptip_holder.css({"margin-left": marg_left+"px", "margin-top": marg_top+"px"}).attr("class","tip"+t_class);
					
					
					if(timeout){ clearTimeout(timeout); }
					console.log("enter");
						timeout = setTimeout(function(){ tiptip_holder
															.stop(true,true)
															.css('opacity', 0)
															.css('display', 'block')
															.animate({opacity: 1}, {queue: false, duration: 50})
															.animate({ top: "-12px" }, 200,
																	function(){ tiptip_holder.animate({ top: "-9px" }, 60,
																					function(){
																								tiptip_holder.animate({ top: "-12px" }, 60);
																								opts.exit(opts.$gadget);
																								console.log("hey");
																								
																							  })
																				})
						}, opts.delay);	
						
						
						
			}				
		});
	}
})(jQuery);  	