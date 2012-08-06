var studentActions  = {
		
		config : {
			identifier: "thisUnit",
			tooltipHolderId: "#tiptip_holder",
			selectedClass: 'selected',
			imageFolderPath: "images",
			idTooltipHolder: "",
			idTooltipContent: ""
		},

		init: function( config ){
			var $memo = $("body");
			var data = $memo.data();
		
			//Adds data from the call to the options object
			studentActions.config = $.extend(studentActions.config, config);
			console.log("unit instanciada con : "+studentActions.config.identifier);
			//Set-Up main properties
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			// attach listener on start building;
			studentActions.attachListenerUnitReady();
			
			studentActions.buildUi(studentActions.$gadget);
			studentActions.loadEvents();
			
			// finish possible bind events listening
			studentActions.$gadget.find("#notebook").click();
			// notify end
			studentActions.notyfyUnitReady();
		},
		
		 /**
		 * Set-Up of the gadget identifier, in case we are 
		 * in standalone functioning, we assign "__GADGET__" as 
		 * the identifier. The default value is the "body" tag.
		 */
		setUpGadgetIdentifier: function (id){
			console.log("setupGadget");
			console.log(id);
			if (studentActions.config.identifier !== null){
				studentActions.$gadget = $("#" + id);
				console.log(studentActions.$gadget);
			}else{
				studentActions.$gadget = $("body");
			}
		},
		
		/**
		 * Builds the initially required user interface elements
		 * @param $gadget
		 */
		buildUi: function ($gadget){
			studentActions.loadPaginateWidget();
		},
		/**
		 * Load the special fonts to this gadget
		 */
		loadCufon: function(){
			Cufon.replace(".f5");
			Cufon.replace(".f7");
			Cufon.now();
		},
	
		/**
		 * Load the events related to this gadget
		 */
		loadEvents: function(){
			studentActions.$gadget
				.undelegate()
				.delegate( ".buttonTooltip", "click", $.proxy(this.manageTooltipBtns, this.target) )
				.delegate( ".buttonTooltip img", "hover", $.proxy(this.manageRolloverEffectsTooltipBtns, this.target) )
				.delegate( ".buttonTooltip img", "mousedown", $.proxy(this.managePressEffectsTooltipBtns, this.target) )
				.delegate( ".buttonTooltip img", "mouseup", $.proxy(this.manageLeaveEffectsTooltipBtns, this.target) )
				.delegate( "#notebook", "click", $.proxy(this.deleteTooltipLoadEvents, this.target) )
				.delegate( "#arrows", "click", $.proxy(this.managePaginateWidgetButtons, this.target) )
				.delegate( ".tooltipStarter", "hover", $.proxy(this.manageTootipStarterHoverEffects, this.target))
				.delegate( ".tooltipStarter", "click", $.proxy(this.loadTooltip, this.target));
			console.log("loadEvents");
			console.log(studentActions.$gadget);
		},
		
		attachListenerUnitReady: function(){
			var sSectionUnit = null;
			$.subscribe("/unitEvents/unitReady", function(event) { 
  				sSectionUnit = ABA_env.getSection();
  				console.log("breadcrumb:"+sSectionUnit);
	  			masterActions.setStepBreadCrumb(sSectionUnit);
	  			$.unsubscribe("/unitEvents/unitReady");
			});	
				console.log("BreadCrumb listening to UNIT READY");
		},
	
		notyfyUnitReady: function(){
			$.publish("/unitEvents/unitReady"); 
			console.log("UNIT READY -----> FIRE!!!!");
		},
	
		/**
		 * Manage the effect related to the hover event Tooltip Buttons
		 */
		manageRolloverEffectsTooltipBtns: function(event){	
			var $target = $(event.target);
			var $targetContainer=$target.parent();
				if (event.type == 'mouseenter') {
					$targetContainer.addClass("buttonTooltip_rollover");
			    } else {
			    	$targetContainer.removeClass("buttonTooltip_rollover");
			    	$targetContainer.addClass("buttonTooltip");
			    }
		},
		
		manageTootipStarterHoverEffects: function(event){
			var $target = $(event.target);
			var sSection =  ABA_env.getSection();
			if (event.type == 'mouseenter') {
				switch (sSection){
					case "DICTATION":
						$target.addClass("colorBackgroundHover");
						break;
					default:
						$target.addClass("borderDotted");
						break;
				}
				
			} else {
				$target.removeClass("borderDotted");
				$target.removeClass("colorBackgroundHover");
			}
		},
		
		loadTooltip: function(event){
			var $target = $(event.target);
			
			ABA_utils.cancelBubble(event);
			
			var html_content = studentActions.$gadget.find("#tooltip_content_wrapper").html();
			var linkId=$target.attr("id");
			
			var sFilename = $target.attr("filename");
			var sAudioType = $target.attr("audioType");
			var sOkText = $target.attr("text");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			
				// delete current tooltip
				studentActions.deleteTooltip();
				console.log("loadTooltip");
				$target.tipTip({
						maxWidth: "auto", 
						edgeOffset: 95, 
						keepAlive: true,
						content: html_content,
						idHolder: studentActions.config.idTooltipHolder,
						idContent: studentActions.config.idTooltipContent,
						$gadget: studentActions.$gadget,
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
						exit: function(){
						} 
					});
				// load hover events
				studentActions.restoreTooltipStatus(linkId, memo);
			
		},
		
		deleteTooltip: function(event){
			var linkId = studentActions.$gadget.find(studentActions.config.tooltipHolderId).attr("linkid");
			
			console.log("trying to to delete: "+studentActions.config.tooltipHolderId);
			console.log(linkId);
			
			if (linkId != undefined) {
				var $store = $("#"+linkId);
				var memo = $("#"+linkId).data();
				// TURN OFF BUTTONS IN ACTION
				if ( memo.tooltipCLicked != null){
					studentActions.$gadget.find(studentActions.config.tooltipHolderId).find("#"+memo.tooltipCLicked).click();
				}
				studentActions.$gadget.find("#answerElement .response").html("");
				studentActions.$gadget.find(studentActions.config.tooltipHolderId)
					.fadeOut(200)
					.css("top","0");
			}
		},
		
		deleteTooltipLoadEvents: function(event){
			console.log("deletetooltip");
			studentActions.deleteTooltip(event);
		},
		
		
		restoreTooltipStatus: function(linkId, memo){
			if (memo.compareMade){
				studentActions.$gadget.find("#"+linkId).css("text-decoration","underline");
				studentActions.$gadget.find(studentActions.config.tooltipHolderId).find("#compare").parent().addClass("buttonTooltip_audio_hold");
			}
			
			if (memo.recordMade){
				studentActions.$gadget.find(studentActions.config.tooltipHolderId).find("#record").parent().addClass("buttonTooltip_audio_hold");
			}
		},
		
		
		/**
		 * Manage the effect related to the onmousedown event Tooltip Buttons
		 */
		managePressEffectsTooltipBtns: function(event){	
			var $target = $(event.target);
			var image=$target.attr("pressImage");
			var $targetContainer = $target.parent(); 
			var linkId = $(studentActions.config.tooltipHolderId).attr("linkId");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			var typeButton = $target.attr("id");
			if ( (typeButton == memo.tooltipCLicked) || (memo.tooltipCLicked == null) ){
				$target.attr("src",studentActions.config.imageFolderPath+"/"+image+".png");
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
		manageLeaveEffectsTooltipBtns: function(event){	
			var $target = $(event.target);
			var image=$target.attr("normalImage");
			var $targetContainer=$target.parent();
			var linkId = $(studentActions.config.tooltipHolderId).attr("linkId");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			var typeButton = $target.attr("id");
			if ( (typeButton == memo.tooltipCLicked) || (memo.tooltipCLicked == null) ){
				$target.attr("src",studentActions.config.imageFolderPath+"/"+image+".png");
				$targetContainer.removeClass("buttonTooltip_press");
			}
		},
		
		/**
		 * Manage the effect related to the cliked blinking Tooltip Buttons
		 */
		startBlinkTooltipBtns: function(event){
			console.log("blink");
			var $target = $(event.target);
			$target.parent().removeClass("buttonTooltip_audio_hold");
			$target.parent().addClass("buttonTooltip_rollover");
			studentActions.$gadget.undelegate(".buttonTooltip img", "hover");
			var image=$target.attr("pressImage");
			$target.attr("src",studentActions.config.imageFolderPath+"/"+image+".png");
			$target.fadeOut(500).fadeIn(500);
			iconBlink= setInterval( function(){
				$target.fadeOut(500).fadeIn(500);
			},1000);
		},
		
		stopBlinkTooltipBtns: function($target, event){
			console.log("stopBlink");
			var linkId = $(studentActions.config.tooltipHolderId).attr("linkId");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			studentActions.$gadget.delegate( ".buttonTooltip img", "hover", $.proxy(this.manageRolloverEffectsTooltipBtns, this.target) );
			var image=$target.attr("normalImage");
			$target.attr("src",studentActions.config.imageFolderPath+"/"+image+".png");
			$target.stop().css({ opacity: 1 });
			clearInterval(iconBlink);
			$target.parent().removeClass("buttonTooltip_rollover");
			
			switch ($target.attr("id")) {
			case "hear":
				
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
		 * Manage the events related to the Tooltip Buttons
		 */
		manageTooltipBtns: function(event){
			var $target = $(event.target);
			// read tooltip data link attached
			var $tooltipHolder = $target.closest("#tiptip_holder");
			var filename = $tooltipHolder.attr("filename");
			var linkId = $tooltipHolder.attr("linkid");
			var audioType = $tooltipHolder.attr("audiotype");
			var okText = $tooltipHolder.attr("okText");
			console.log($target);
			var typeButton = $target.attr("id");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			var sSection =  ABA_env.getSection();
			var isAnyClicked  = null;
			if( (memo.cueFromServer == null) || (memo.cueFromServer == undefined) ){
				$store.data("cueFromServer",false);
			}
			
			ABA_utils.cancelBubble(event);
			switch (typeButton){
				case "hear":
					isAnyClicked = ( memo.isClickedRecord || memo.isClickedCompare );
					if(!isAnyClicked){
							if(!memo.isClickedHear){
								$store.data("isClickedHear",true);
								$store.data("tooltipCLicked","hear");
								$store.data("cueFromServer",false);
									console.log("hearing...");
//									iconTimeoutHear = setTimeout(function(){$target.click();}, 60000);
									studentActions.startBlinkTooltipBtns(event);
									//TODO: diferent "demo" or "student" depends of record or play 
									studentActions.startPlay(filename, audioType, "demo");
							} else {
								//TODO: make a function to write this logic
								$store.data("isClickedHear",false);
								$store.data("tooltipCLicked",null);
									studentActions.stopBlinkTooltipBtns($target, event);
//									clearTimeout(iconTimeoutHear);
//									alert("lo estoy parando yo1");
									if(sSection=="GRAMMAR"){
										console.log("notifify to server: audio hear")
										studentActions.stopElement(true);
										studentActions.$gadget.find("#"+linkId).css("text-decoration","underline");
									} else {
										console.log("DON'T notifify HEAR !!!");
										studentActions.stopElement(false);
									}
							}
					}
					break;
					
				case "record":
					
					isAnyClicked = ( memo.isClickedHear || memo.isClickedCompare );
					if(!isAnyClicked){
							if(!memo.isClickedRecord){
								$store.data("isClickedRecord",true);
								$store.data("tooltipCLicked","record");
								$store.data("cueFromServer",false);
									studentActions.$gadget.find(studentActions.config.tooltipHolderId).addClass("keepAlive");
									console.log("recording...");
									studentActions.startBlinkTooltipBtns(event);
									iconTimeoutRecord = setTimeout(function(){$target.click();}, 60000);
									studentActions.startRecord(filename);
							} else {
								$store.data("isClickedRecord",false);
								$store.data("tooltipCLicked",null);
								$store.data("recordMade",true);
									studentActions.stopBlinkTooltipBtns($target,event);
									clearTimeout(iconTimeoutRecord);
//									alert("lo estoy parando yo2");
									studentActions.stopElement(true); // without notify
							}
					}
					break;
					
				case "compare":
					console.log(sSection+"+"+typeButton);
						switch(sSection){
						
								case "STUDY":
								case "NEWWORDS":
								case "SPEAKING":
									
											isAnyClicked = ( memo.isClickedHear || memo.isClickedRecord );
											
											if(!isAnyClicked && memo.recordMade){
												
													if(!memo.isClickedCompare){
														$store.data("isClickedCompare",true);
														$store.data("tooltipCLicked","compare");
														$store.data("cueFromServer",false);
														studentActions.$gadget.find(studentActions.config.tooltipHolderId).addClass("keepAlive");
															console.log("compare....");
															switch(memo.compareState){
																case "step1":
																	console.log("compares1");
																	$store.data("compareState","step2");
																	studentActions.startBlinkTooltipBtns(event);
																	studentActions.startPlay(filename, audioType, "demo");
																	break;
																case "step2":
																	console.log("compares2");
																	break;
																default:
																	console.log("comparedefault");
																	$store.data("compareState","step1");
																	studentActions.startBlinkTooltipBtns(event);
																	studentActions.startPlay(filename, audioType, "student");
																break;
															}
															// TODO: set sequence play and record
															
													} else {
														$store.data("isClickedCompare",false);
														$store.data("tooltipCLicked",null);
															studentActions.stopBlinkTooltipBtns($target,event);
															
															if( (memo.compareState=="step2") && (memo.cueFromServer) ){
																$store.data("compareMade",true);
																$store.data("compareState",false);
																$target.parent().addClass("buttonTooltip_audio_hold");
																studentActions.$gadget.find("#"+linkId).css("text-decoration","underline");
															}
																
																if(!memo.cueFromServer){
																	$store.data("compareState",null);
																}
																
															studentActions.stopElement(true); // without notify
													}
											}
											
									break;
									
								case "DICTATION":
									var $inputTarget = studentActions.$gadget.find("#"+linkId);
									var isTextOK = null;
									var textTrimmed = ABA_utils.trim( $inputTarget.val() );
									
									if(  textTrimmed != "" ){
											isTextOK = ABA_utils.doValidate($inputTarget.val(),okText);
											PROXY_env.HTMLSetDictationItemValue(linkId ,filename, isTextOK, $inputTarget.val());
											if(isTextOK){
												studentActions.markInputAsOK($inputTarget);
											} else {
												studentActions.markInputAsNOOK($inputTarget);
											}
									}	else   {
											studentActions.notMarkInput($inputTarget);
									}
									break;
									
							}
					
					break;
				case "answer":
						studentActions.$gadget.find("#answerElement .response").html(okText);
					break;
			}
		},
		
		notMarkInput: function($inputTarget){
			$inputTarget.removeClass("inputOk");
			$inputTarget.removeClass("inputNook");
		},
		markInputAsOK: function($inputTarget){
			$inputTarget.removeClass("inputNook");
			$inputTarget.addClass("inputOk");
		},
		
		markInputAsNOOK: function($inputTarget){
			$inputTarget.removeClass("inputOk");
			$inputTarget.addClass("inputNook");;
		},
		
		getUsername: function(){
			return PROXY_env.getUsernameProxy();
		},
		
		getMicroPermission: function(){
			return parent.masterActions.getMicroPermission();
		},
		cueStopHearing: function(){
			// current link active and rebuild memo
			var $tooltipHolder = studentActions.$gadget.find(studentActions.config.tooltipHolderId);
			var linkId = $tooltipHolder.attr("linkid");
			var $store = $("#"+linkId);
			var memo = $("#"+linkId).data();
			var sTooltipClicked = memo.tooltipCLicked;
			var sCompareState = memo.compareState;
			$store.data("cueFromServer",true);
			// rebuild target and event for call function event
			if ( (memo.tooltipCLicked!=null) && (memo.tooltipCLicked!=undefined) ) {
				$target = $tooltipHolder.find("#"+memo.tooltipCLicked);
				$target.click();
				if(sTooltipClicked=="compare" && sCompareState!="step2"){
					iconTimeoutCompare = setTimeout(function(){$target.click();}, 100);
				}
			}
		},
		
		startPlay: function(filename,audioType,listenType){
			PROXY_env.HTMLListenElement(filename,audioType,listenType);
		},
		
		stopElement: function(inNotify){
			console.log("listen call stop");
			PROXY_env.HTMLStopElement(inNotify);
		},
		
		startRecord: function(filename){
					if(studentActions.getMicroPermission){
						PROXY_env.HTMLRecordElement(filename);						
					} else {
						// TODO: TRIGGER ERROR window
					}
		},
		
		
		/*
		 * load this: 
		 * <div id="paginateWidgetWrapper" style="display: none;" >
		 *  <div id="arrows">
		 *	 <img alt="left arrow" src="images/left_arrow.png" 	class="left_arrow left"/>
		 *	 <img alt="right arrow" src="images/right_arrow.png" 	class="right"/>
		 *	 <p class="f5 pag">PASO <span class="f6">1</span>/3</p>
		 *  </div>
		 * </div>
		 */
		
		loadPaginateWidget: function(){
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			var $gadget = studentActions.$gadget;
			var sPreviousOne = ABA_env.getPreviousPage();
			var sNextOne = ABA_env.getNextPage();
			var sStep = String(ABA_env.getInxPageSection());
			var sTotalSteps = String(ABA_env.getTotalPagesSection());
			var $widget = null;
			
			var $widget = $('<div id="arrows"></div>');
			if( (sPreviousOne!=undefined) && (sPreviousOne!=null) && (sPreviousOne!="") ){
				$widget.append('<img alt="left arrow" src="images/left_arrow.png" id="previous" page="'+sPreviousOne+'" class="left_arrow left"/>');
			}
			if( (sNextOne!=undefined) && (sNextOne!=null)  && (sNextOne!="") ){
				$widget.append('<img alt="right arrow" src="images/right_arrow.png" id="next" page="'+sNextOne+'" class="right"/>');
			}
			$widget.append('<p class="f5 pag">' + studentActions.config.steepText +' <span class="f6">'+sStep+'</span>/'+sTotalSteps+'</p>');
			$gadget.find("#notebook_footer").append($widget);
			studentActions.loadCufon();
		},
		
		managePaginateWidgetButtons: function(event){
			var $target = $(event.target);
			var sIdPaginate = $target.attr("id");
			var sPage = $target.attr("page"); 
			console.log("NEXT PAGE: >>>"+sPage);
			switch(sIdPaginate){
				case "previous":
				case "next":
						masterActions.loadUnit(sPage);
					break;
			}
		}
		
};