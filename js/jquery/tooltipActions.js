(function($){
 
    //Attach this new method to jQuery
    $.fn.extend({
    	
    	tooltp_init: function( options ){
    		
    		var defaults = {
    			widgetDomain: "thisUnit",
    			imageFolderPath: "images",
    			idTooltipHolder: "#tiptip_holder",
    			idTooltipContent: "",
    			idTooltipWrapper: "#tooltip_content_wrapper",
    			tooltipStarterClass: "tooltipStarter",
    			deleteAndUnbind: false,
    			listenerTooltipClass: 		"listenerTooltip",
    			serverOriginAudio:  		"",
    			tooltipWritingAudioType: 	"f3", 
    			offset: 88
    		};
    		
    	 	var config = $.extend(defaults, options);
			
			var $gadget = $(this).tooltp_setUpGadgetIdentifier(config.widgetDomain);
			
			config.gadget = $gadget;
	
			$(this).tooltp_loadEvents($gadget,$(this),config);
			console.log("whatss happen");
			
			// save section in notebbok item
			$notebook = $gadget.find("#notebook");
			$storeNotebook = $notebook;
			$storeNotebook.data(config.section);
			
			return this.each(function() {
				$store = $(this);
				$store.data(config);
				memo  = $store.data();
				console.log("example of memo-------------");
				console.log($(this));
				console.log(memo);
			});
			
		},
		
		 /**
		 * Set-Up of the gadget identifier
		 */
		tooltp_setUpGadgetIdentifier: function (id){
			console.log("setupGadget");
			console.log(id);
			return $("#" + id);
		},
		
		 /**
		 * get section info to switch section UX 
		 */
		tooltp_getSection: function(memo){ 
			if( memo.section == undefined ){
				return ABA_env.getSection();
			} else {
				return memo.section;
			}
		},
		
		 /**
		 * load all events related to this tooltip
		 */
		tooltp_loadEvents: function($gadget,$widget,config){
			$gadget.undelegate(".buttonTooltip", "click");
			$gadget.undelegate(".buttonTooltip img","hover");
			$gadget.undelegate(".buttonTooltip img","mousedown");
			$gadget.undelegate(".buttonTooltip img","mouseup");
			$gadget.undelegate("#notebook", "click");
			$widget.unbind("hover");
			$widget.unbind("click");
			$widget.removeClass(config.listenerTooltipClass);
			
			$gadget.delegate(".buttonTooltip", "click", function(event){
					$.fn.tooltp_manageTooltipBtns(event);
				});
			$gadget.delegate(".buttonTooltip img", "hover", function(event){
					$.fn.tooltp_manageRolloverEffectsTooltipBtns(event);	
				});
			$gadget.delegate(".buttonTooltip img", "mousedown", function(event){
				$.fn.tooltp_managePressEffectsTooltipBtns(event);	
			});
			$gadget.delegate(".buttonTooltip img", "mouseup", function(event){
				$.fn.tooltp_manageLeaveEffectsTooltipBtns(event);	
			});
			$gadget.delegate(  "#notebook", "click", function(event){
				$.fn.tooltp_deleteTooltipLoadEvents(event);
				});

			$widget.bind( "hover", function(event){
				$.fn.tooltp_manageTootipStarterHoverEffects(event);	
			}); 
			$widget.bind("click", function(event){
				$.fn.tooltp_manageActionsClickEvent(event);	
			}); 
			$widget.addClass(config.listenerTooltipClass);
		},
		
		/**
		 * Manage the effect related to the cliked blinking Tooltip Buttons
		 */
		tooltp_startBlinkTooltipBtns: function(event,config){
			console.log("blink");
			var $target = $(event.target);
			$target.parent().removeClass("buttonTooltip_audio_hold");
			$target.parent().addClass("buttonTooltip_rollover");
			config.gadget.undelegate(".buttonTooltip img", "hover");
			var image=$target.attr("pressImage");
			$target.attr("src",config.imageFolderPath+"/"+image+".png");
			$target.fadeOut(500).fadeIn(500);
			iconBlink= setInterval( function(){
				$target.fadeOut(500).fadeIn(500);
			},1000);
		},
		
		 /**
		 * Manage the effect related to the cliked blinking Tooltip Buttons
		 */
		tooltp_stopBlinkTooltipBtns: function($target, event, config){
			console.log("stopBlink");
			var linkId = $("#"+config.idTooltipHolder).attr("linkId");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			config.gadget.delegate(".buttonTooltip img", "hover", function(event){
				$.fn.tooltp_manageRolloverEffectsTooltipBtns(event);
			});
			var image=$target.attr("normalImage");
			var sSection =  $.fn.tooltp_getSection(memo);
			$target.attr("src",config.imageFolderPath+"/"+image+".png");
			$target.stop().css({ opacity: 1 });
			clearInterval(iconBlink);
			$target.parent().removeClass("buttonTooltip_rollover");
			
			switch ($target.attr("id")) {
			case "hear":
//				switch(sSection){
//					case "GRAMMAR":
//					case "WRITING":
						if(memo.hearMade){
							$target.parent().addClass("buttonTooltip_audio_hold");
						}
//						break;
//				}
				break;
			case "compare":
				if(memo.compareMade){
					$target.parent().addClass("buttonTooltip_audio_hold");
				}
				break;
			case "record":
					$target.parent().addClass("buttonTooltip_audio_hold");
				break;
			}
			
		},
		
		/**
		 * Manage the effect related to the onmousedown event Tooltip Buttons
		 */
		tooltp_managePressEffectsTooltipBtns: function(event){	
			var $target = $(event.target);
			var image=$target.attr("pressImage");
			var $targetContainer = $target.parent(); 
			var linkId = $target.closest(".tip_top").attr("linkId");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			
			var typeButton = $target.attr("id");
			if ( (typeButton == memo.tooltipCLicked) || (memo.tooltipCLicked == null) ){
				$target.attr("src",memo.imageFolderPath+"/"+image+".png");
				$targetContainer.addClass("buttonTooltip_press");
			}
			if (typeButton == memo.tooltipCLicked ){
				setTimeout(function(){
					$targetContainer.removeClass("buttonTooltip_press");
					}, 200);
			};
		},
		
		/**
		 * Manage the effect related to the onmousedown event Tooltip Buttons
		 */
		tooltp_manageLeaveEffectsTooltipBtns: function(event){	
			var $target = $(event.target);
			var image=$target.attr("normalImage");
			var $targetContainer=$target.parent();
			var linkId = $target.closest(".tip_top").attr("linkId");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			
		
			var typeButton = $target.attr("id");
			if ( (typeButton == memo.tooltipCLicked) || (memo.tooltipCLicked == null) ){
				$target.attr("src",memo.imageFolderPath+"/"+image+".png");
				$targetContainer.removeClass("buttonTooltip_press");
			}
		},
		
		
		/**
		 * Manage the events related to the Tooltip Buttons
		 */
		tooltp_manageTooltipBtns: function(event){
			console.log("MANAGE BUTTONS!!!!!!");
			var $target = $(event.target);
			// read tooltip data link attached
			var $tooltipHolder = $target.closest(".tip_top");
			var filename = $tooltipHolder.attr("filename");
			var linkId = $tooltipHolder.attr("linkid");
			var audioType = $tooltipHolder.attr("audiotype");
			var okText = $tooltipHolder.attr("okText");
			console.log("********!!!!!!!!!!**********");
			console.log(linkId);
			var typeButton = $target.attr("id");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			var sSection =  $.fn.tooltp_getSection(memo);
			var isAnyClicked  = null;
			if( (memo.cueFromServer == null) || (memo.cueFromServer == undefined) ){
				$store.data("cueFromServer",false);
				console.log("NOT CUED FROM THE SERVER !!!!");
			}
			
			console.log("under this: log the linkid and the store");
			console.log(linkId);
			console.log($store);
			
			ABA_utils.cancelBubble(event);
			switch (typeButton){
				case "hear":
						$.fn.tooltp_hearAudioProcess(event, $store, memo, typeButton);
					break;
					
				case "record":
					
					isAnyClicked = ( memo.isClickedHear || memo.isClickedCompare  || memo.isClickedAnswer  );
					if(!isAnyClicked){
							if(!memo.isClickedRecord){
								$store.data("isClickedRecord",true);
								$store.data("tooltipCLicked","record");
								$store.data("cueFromServer",false);
									memo.gadget.find("#"+memo.idTooltipHolder).addClass("keepAlive");
									console.log("recording...");
									$.fn.tooltp_startBlinkTooltipBtns(event, memo);
									iconTimeoutRecord = setTimeout(function(){$target.click();}, 12000);
									studentActions.startRecord(filename);
							} else {
								$store.data("isClickedRecord",false);
								$store.data("tooltipCLicked",null);
								$store.data("recordMade",true);
									$.fn.tooltp_stopBlinkTooltipBtns($target,event, memo);
									clearTimeout(iconTimeoutRecord);
									studentActions.stopElement(true); // without notify
									switch(sSection){
										case "ROLEPLAY":
											studentActions.nextStepRolePlayProccess();
										break;
									}
									
							}
					}
					break;
					
				case "compare":
					console.log(sSection+"+"+typeButton);
						switch(sSection){
								case "DICTATION":
								case "WRITING":
									 var isTextOk = studentActions.validateInputText(linkId , okText , filename);
									 if(isTextOk){
										var  $buttonPress = memo.gadget.find(".tip_top").find("#compare");
										$buttonPress.parent().addClass("buttonTooltip_audio_hold");
										 $store.data("compareMade",true);
                                                                                 if(sSection=="WRITING"){
                                                                                     studentActions.$gadget.find("#"+linkId).closest("."+memo.tooltipWritingAudioType).css("text-decoration","underline");
                                                                                 }
									 }
									break;
								default:
									$.fn.tooltp_compareAudioProcess(event, $store, memo, typeButton);
									break;
							}
					
					break;
					
				case "answer":
					switch(sSection){
						case "SPEAKING":
							$.fn.tooltp_hearAudioProcess(event, $store, memo, typeButton);
						break;
					}
					memo.gadget.find("#answerElement .response").html(okText);
				break;
				
					
				
			}
		},
		
		/**
		 * Manage hear audio process
		 */
		tooltp_hearAudioProcess: function(event, $store, memo, typeButton){
			
			var $target = $(event.target);
			// read tooltip data link attached
			var $tooltipHolder 	= $target.closest(".tip_top");
			var filename 		= $tooltipHolder.attr("filename");
			var linkId 			= $tooltipHolder.attr("linkid");
			var audioType 		= $tooltipHolder.attr("audiotype");
			
			var sSection =  $.fn.tooltp_getSection(memo);
			
			switch(typeButton){
			case "hear":
				isClickedItem = memo.isClickedHear;
				break;
			case "answer": 
				isClickedItem = memo.isClickedAnswer;
				break;
			}
			
			isAnyClicked = ( memo.isClickedRecord || memo.isClickedCompare );
			if(!isAnyClicked){
					if(!isClickedItem){
						
						switch(typeButton){
						case "hear":
							$store.data("isClickedHear",true);
							break;
						case "answer":
							$store.data("isClickedAnswer",true);
							break;
						}
						
						$store.data("tooltipCLicked",typeButton);
						$store.data("cueFromServer",false);
							console.log("hearing...");
	//						iconTimeoutHear = setTimeout(function(){$target.click();}, 60000);
							$.fn.tooltp_startBlinkTooltipBtns(event, memo);
							//TODO: diferent "demo" or "student" depends of record or play 
							iconTimeoutHear = setTimeout(function(){$target.click();}, 10000);
							switch(sSection){
								case "ROLEPLAY":
									studentActions.startPlay(filename, audioType, memo.serverOriginAudio);
								break;
								default: 
									studentActions.startPlay(filename, audioType, "demo");
								break;
							}

					} else {
						
						switch(typeButton){
						case "hear":
							$store.data("isClickedHear",false);
							break;
						case "answer":
							$store.data("isClickedAnswer",false);
							break;
						}
						//TODO: make a function to write this logic
						
						$store.data("tooltipCLicked",null);
						
	//						clearTimeout(iconTimeoutHear);
	//						alert("lo estoy parando yo1");
						clearTimeout(iconTimeoutHear);
						
							switch(sSection){
								case "GRAMMAR":
								case "WRITING":
									console.log("notifify to server: audio hear");
									studentActions.stopElement(true);
									memo.gadget.find("#"+linkId).not("input").css("text-decoration","underline");
									$store.data("hearMade",true);
									//TODO: make a function for WRITTING
								break;
								case "ROLEPLAY":
									studentActions.nextStepRolePlayProccess();
									if(memo.recordMade){
										memo.gadget.find("#"+linkId+".recordRole").css("text-decoration","underline");
										studentActions.stopElement(true);
									} else {
										studentActions.stopElement(false);
									}
								break;
								default: 
									console.log("DON'T notifify HEAR !!!");
									studentActions.stopElement(false)
									$store.data("hearMade",true);
								break;
							}
							
							$.fn.tooltp_stopBlinkTooltipBtns($target, event, memo);
					}
			}
		},
		
		/**
		 * Manage compare audio process
		 */
		
		tooltp_compareAudioProcess: function(event, $store, memo, typeButton ){
			
			var $target = $(event.target);
			// read tooltip data link attached
			var $tooltipHolder 	= $target.closest(".tip_top");
			var filename 		= $tooltipHolder.attr("filename");
			var linkId 			= $tooltipHolder.attr("linkid");
			var audioType 		= $tooltipHolder.attr("audiotype");
			var isClickedItem 	= null;
			console.log("MEMORY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			console.log(memo);
			
			isClickedItem = memo.isClickedCompare;
			
			isAnyClicked = ( memo.isClickedHear || memo.isClickedRecord);
			
			if(!isAnyClicked && memo.recordMade){
				
							if(!isClickedItem){
								
						$store.data("isClickedCompare",true);	
						$store.data("tooltipCLicked",typeButton);
						$store.data("cueFromServer",false);
						memo.gadget.find("#"+memo.idTooltipHolder).addClass("keepAlive");
						
							console.log("compare....");
							switch(memo.compareState){
								case "step1":
									console.log("compares1");
									$store.data("compareState","step2");
									$.fn.tooltp_startBlinkTooltipBtns(event, memo);
									iconTimeoutHear = setTimeout(function(){$target.click();}, 10000);
									studentActions.startPlay(filename, audioType, "demo");
									break;
								case "step2":
									console.log("compares2");
									break;
								default:
									console.log("comparedefault");
									console.log($store);
									$store.data("compareState","step1");
									$.fn.tooltp_startBlinkTooltipBtns(event, memo);
									iconTimeoutHear = setTimeout(function(){$target.click();}, 10000);
									studentActions.startPlay(filename, audioType, "student");
								break;
							}
							// TODO: set sequence play and record
							
					} else {
							
						$store.data("isClickedCompare",false);
						$store.data("tooltipCLicked",null);
						$.fn.tooltp_stopBlinkTooltipBtns($target,event, memo);
							
							if( (memo.compareState=="step2") && (memo.cueFromServer) ){
								$store.data("compareMade",true);
								$store.data("compareState",false);
								$target.parent().addClass("buttonTooltip_audio_hold");
								memo.gadget.find("#"+linkId).not("input").css("text-decoration","underline");
								var nQuest = studentActions.getNumberQuestions();
								studentActions.setNumberQuestions(nQuest+1);
								studentActions.refreshNumberQuestions(nQuest+1);
							}
								
								if(!memo.cueFromServer){
									$store.data("compareState",null);
								}
							clearTimeout(iconTimeoutHear);
							studentActions.stopElement(true); // without notify
					}
			}
			
		},
		
		/**
		 * Manage rollover effect tooltip buttons
		 */
		
		tooltp_manageRolloverEffectsTooltipBtns: function(event){	
			var $target = $(event.target);
			var $targetContainer=$target.parent();
				if (event.type == 'mouseenter') {
					$targetContainer.addClass("buttonTooltip_rollover");
			    } else {
			    	$targetContainer.removeClass("buttonTooltip_rollover");
			    	$targetContainer.addClass("buttonTooltip");
			    }
		},
		
		
		/**
		 * Manage hover effect for tooltipStarter link
		 */
		
		tooltp_manageTootipStarterHoverEffects: function(event){
			var $target = $(event.target);
			var memo = $target.data();
			var sSection = $.fn.tooltp_getSection(memo);
			if (event.type == 'mouseenter') {
				switch (sSection){
					case "WRITING":
						$target.not("input").addClass("borderDotted");
					case "DICTATION":
								switch(memo.inputOk){
									case true:
										$target.addClass("colorBackgroundHoverInputOk");
										break;
									case false:
										$target.addClass("colorBackgroundHoverInputNOOk");
										break;
									default:
										$target.addClass("colorBackgroundHover");
										break;
									}
						break;
					default:
						$target.addClass("borderDotted");
						break;
				}
				
			} else {
				$target.removeClass("borderDotted");
				studentActions.removeRolloverClasses($target);
			}
		},
		
		/**
		 * Manage clik effect for tooltipStarter link
		 */
		tooltp_manageActionsClickEvent: function(event){
			var $target = $(event.target);
			ABA_utils.cancelBubble(event);
			var $store = $target;
			var memo = $store.data();
			$.fn.tooltp_loadTooltip(event, memo.gadget);
			console.log("attach keypress event to input:"+$target.attr("id"));
			$target.unbind('keypress'); 
			$target.bind('keypress',  function(event) { 	
						$.fn.tooltp_loadInputKeyboardEvent(event,memo); 
					} );
		},
		
		/**
		 * main function, load tooltip
		 */
		tooltp_loadTooltip: function(event, $gadget){
			var $target = $(event.target);

			var linkId=$target.attr("id");
			var sFilename = $target.attr("filename");
			var sAudioType = $target.attr("audioType");
			var sOkText = $target.attr("text");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			var sSection = $.fn.tooltp_getSection(memo);
			var $notebook = $target.closest("#notebook");
			
			 switch(sSection){
				 case "ROLEPLAY":
					 $target.unbind("click");
				 break;
			 }
			
			console.log("linkid:"+linkId);
			console.log("wrapper:"+memo.idTooltipWrapper);
			console.log("idTooltipHolder:"+memo.idTooltipHolder);
			console.log("idTooltipContent:"+memo.idTooltipContent);
			
			var html_content = $gadget.find(memo.idTooltipWrapper).html();
			console.log(html_content);
			
				// delete current tooltip
				$.fn.tooltp_deleteTooltip($notebook);
				console.log("loadTooltip");
				$target.tipTip({
						maxWidth: "auto", 
						edgeOffset: memo.offset, 
						keepAlive: true,
						content: html_content,
						idHolder: memo.idTooltipHolder,
						idContent: memo.idTooltipContent,
						$gadget: $gadget,
						locateParams : [
						     {
						    	 attr : "linkId",
						    	 value : linkId
						     },          
						     {
						    	 attr : "filename",
						    	 value : sFilename
						     }, 
						     {
						    	 attr : "audioType",
						    	 value : sAudioType
						     },
						     {
						    	 attr: "okText",
						    	 value : sOkText
						     }
						],			
						delay: 0,
						exit: function($gadget){
							 switch(sSection){
								 case "ROLEPLAY":
									$gadget.find("#"+memo.idTooltipHolder).find("#hear").click();
								 break;
							 }
						} 
					});
				$target.addClass("workingTooltip");
				// load hover events
				$.fn.tooltp_restoreTooltipStatus(linkId, memo);

		},
		
		/**
		 * manage press keyboard event
		 */
		tooltp_loadInputKeyboardEvent: function(event, memo){
			console.log("action if keypress");
				var code = (event.keyCode ? event.keyCode : event.which);
				var $target = $(event.target);
				var linkId=$target.attr("id");
				
//				var linkId = $tooltipHolder.attr("linkid");
				var sFilename = $target.attr("filename");
				var sOkText = $target.attr("text");
			
				// intro action
				 if(code == 13) { 
					 var isTextOk = studentActions.validateInputText(linkId , sOkText , sFilename);
					 if(isTextOk){
						var $store = $("#"+linkId);
						var memo = $("#"+linkId).data();
						var  $buttonPress = memo.gadget.find(".tip_top").find("#compare");
						$buttonPress.parent().addClass("buttonTooltip_audio_hold");
						$store.data("compareMade",true);
					 }
					
				 }
				 
				 
		},
		
		/**
		 * delete tooltip
		 */
		tooltp_deleteTooltip: function($widget){
			var linkId = $widget.find(".workingTooltip").attr("id");
			console.log($widget);
			console.log("searchikng linkid of current tooltip: "+linkId);
			$element =  $("#"+linkId);
			var $store = $element;
			var memo = $store.data();
			
			if (linkId != undefined) {
				console.log("trying to to delete: "+memo.idTooltipHolder);
				console.log(linkId);
				// TURN OFF BUTTONS IN ACTION
				console.log(memo.tooltipCLicked);
				if ( memo.tooltipCLicked != null ){
					memo.gadget.find("#"+memo.idTooltipHolder).find("#"+memo.tooltipCLicked).click();
				}
				memo.gadget.find("#answerElement .response").html("");
				memo.gadget.find("#"+memo.idTooltipHolder)
					.fadeOut(200)
					.css("top","0");
				$element.removeClass("workingTooltip");
				
			}
			
		},
		
		/**
		 * made for calling from outside
		 * reset the element passed
		 */
		tooltp_Unbind: function(){
			return this.each(function() {
				$store = $(this);
				memo  = $store.data();
				if (memo.deleteAndUnbind){
					$(this).unbind( "hover" ); 
					$(this).unbind( "click" );
					$(this).removeClass(memo.listenerTooltipClass);
					$(this).removeClass("borderDotted");
				}
			});
			
		},
		
		/**
		 * manage delete calling
		 */
		tooltp_deleteTooltipLoadEvents: function(event){

			console.log("deletetooltip");
			var $target = $(event.target);
			var $notebook = $target.closest("#notebook");
			
			var $storeNotebook = $notebook;
			var memoNotebook = $storeNotebook.data();
			
			var sSection = $.fn.tooltp_getSection(memoNotebook);
			
			switch(sSection){
				case "ROLEPLAY":
				break;
				default:
					$.fn.tooltp_deleteTooltip($notebook);
				break;
			}
		
		},
		
		/**
		 * restore tooltip buttons and links status
		 */
		tooltp_restoreTooltipStatus: function(linkId, memo){
			
			if (memo.compareMade){
				memo.gadget.find("#"+linkId).not("input").css("text-decoration","underline");
				memo.gadget.find("#"+memo.idTooltipHolder).find("#compare").parent().addClass("buttonTooltip_audio_hold");
			}
			
			if (memo.recordMade){
				memo.gadget.find("#"+memo.idTooltipHolder).find("#record").parent().addClass("buttonTooltip_audio_hold");
			}
			if (memo.hearMade){
				memo.gadget.find("#"+memo.idTooltipHolder).find("#hear").parent().addClass("buttonTooltip_audio_hold");
			}
			
		},
		
		
    });
    
    })(jQuery);