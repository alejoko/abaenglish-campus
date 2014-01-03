var studentActions  = {
		
		config : {
			identifier: "thisUnit",
			generalTooltipClass: "tip_top",
			selectedClass: 'selected',
			mediaFont: 'f3',
			normalFont: 'f4',
			recordRoleClass: "recordRole",
			playRoleClass: "playRole",
			blockTextClass: "block_text",
			leftColumnClass: "column_left",
			rightColumnClass: "column_right",
			classStepComplete: "rolePlayStepComplete",
			numberQuestions: 0
		},
		
		init: function( config ){
			var $memo = $("body");
			var data = $memo.data();
			var sSectionUnit = ABA_env.getSection();
			//Adds data from the call to the options object
			studentActions.config = $.extend(studentActions.config, config);
			//Set-Up main properties
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			// attach listener on start building;
			studentActions.attachListenerUnitReady();
			
			studentActions.loadEvents(sSectionUnit);
			studentActions.buildUi(studentActions.$gadget);
			
			// finish possible bind events listening
			studentActions.$gadget.find("#notebook").click();
			// notify end
			studentActions.notifyUnitReady();
		},
		
		 /**
		 * Set-Up of the gadget identifier, in case we are 
		 * in standalone functioning, we assign "__GADGET__" as 
		 * the identifier. The default value is the "body" tag.
		 */
		
		setUpGadgetIdentifier: function (id){
			if (studentActions.config.identifier !== null){
				studentActions.$gadget = $("#" + id);
			}else{
				studentActions.$gadget = $("body");
			}
		},
		
		/**
		 * Builds the initially required user interface elements
		 * @param $gadget
		 */
		
		buildUi: function ($gadget){
			var sSection =  ABA_env.getSection();
			studentActions.loadCufon();
			studentActions.setNumberQuestions(0);
			switch(sSection){
				case "MINITEST":
						studentActions.loadPaginateWidgetMinitestCase();
					break;
				case "ROLEPLAY": 
						studentActions.manageChangesRolePlaySection();
						studentActions.loadPaginateWidget();
						studentActions.resizeBlockPagePadding(sSection);
					break;
				case "ROLEPLAY_SELECT":
					break;
				case "DICTATION":
				case "SPEAKING":
						studentActions.resizeBlockPagePadding(sSection);
				default: 
						studentActions.loadPaginateWidget();
					    studentActions.loadAllTooltips();
					break;
			}
		},
		
		resizeBlockPagePadding: function(sSection){
			var $blockText = studentActions.$gadget.find("."+studentActions.config.blockTextClass);
			var sPaddingBlockText = $blockText.css("padding-top");
			var nPaddingBlockText = parseInt(sPaddingBlockText.replace("px",""));
			var nPaddingSpaceFilled = $blockText.size() * nPaddingBlockText; 
		
			var $colummRight = studentActions.$gadget.find("."+studentActions.config.rightColumnClass);
			var nColHeight = 0 ;
			$colummRight.each(function(){
				var nPaddingColHeight = $(this).height();
				nColHeight = nColHeight +  nPaddingColHeight;
			});
			
			var nTotalHeader = studentActions.$gadget.find("#notebook_header").height();
			
			var sPositionEndElement = null;
			var nPositionEndElement = null;
			var nblockButtonsSpace = null;
			//notebook_footer
			switch (sSection){
				case "DICTATION":
				case "SPEAKING":
					nblockButtonsSpace = 0;
					sPositionEndElement = studentActions.$gadget.find("#answerElement").css("top");
					nPositionEndElement = parseInt(sPositionEndElement.replace("px",""));
				break;
				case "ROLEPLAY":
					nblockButtonsSpace = studentActions.$gadget.find(".block_buttons").height();
					nPositionEndElement = "480";
				break;
			}
			
			var nTotalSpace = nColHeight + nPaddingSpaceFilled + nTotalHeader + nblockButtonsSpace; 
			var nFreeSpace = nPositionEndElement - nTotalSpace; 
			
			var nFreeSpacePerBlock = null;
			
			switch (sSection){
				case "DICTATION":
				case "SPEAKING":
					var nFreeSpacePerBlock = parseInt(nFreeSpace / ($blockText.size() + 2));
				break;
				case "ROLEPLAY":
					var nFreeSpacePerBlock = parseInt(nFreeSpace / ($blockText.size() + 2));
				break;
			}
			
			if ($blockText.size()>4){
				studentActions.$gadget.find("."+studentActions.config.blockTextClass).css("padding-top",nFreeSpacePerBlock+nPaddingBlockText);
			}
			
		},
		
		manageChangesRolePlaySection: function(){
			studentActions.$gadget.find(".block_buttons").show();
			$target= null;
			
			var sRoleRecord  	= ABA_env.getRoleRecord();
			
			$target = studentActions.$gadget.find("[role='"+sRoleRecord+"']");
			$target.removeClass();
			$target.addClass(studentActions.config.mediaFont);
			$target.addClass(studentActions.config.recordRoleClass);
			
			var sRolePlay  		= ABA_env.getRolePlay();
			
			$.each(sRolePlay, function(){
				$target = studentActions.$gadget.find("[role='"+this+"']");
				$target.removeClass();
				$target.addClass(studentActions.config.normalFont);
				$target.addClass(studentActions.config.playRoleClass);	
			});
		}, 
		
		/**
		 * Load the special fonts to this gadget
		 */
		loadCufon: function(){
			studentActions.$gadget.find(".infoItem").show();
			studentActions.$gadget.find(".infoItemSp").show();
			studentActions.$gadget.find(".f15").show();
			studentActions.$gadget.find(".f7").show();
			
			Cufon.replace(".f5");
			Cufon.replace(".f6");
			Cufon.replace(".f7");
			Cufon.replace(".f11");
			Cufon.replace(".f12");
			Cufon.replace(".f13");
			Cufon.replace(".f15");
			Cufon.now();
		},
	
		/**
		 * Load the events related to this gadget
		 */
		
		loadEvents: function(sSection){
			studentActions.$gadget.undelegate();
			switch(sSection){
				case "MINITEST":
						studentActions.$gadget
							.delegate( "#arrows", "click", $.proxy(this.managePaginateWidgetButtonsMinitestCase, this.target) )
							.delegate( "input[type='checkbox']" , "click", $.proxy(this.manageCheckboxInput, this.target) )
							.delegate( ".buttonCheck", "click",  $.proxy(this.manageCheckButtonClick, this.target) );
					break;
				case "ROLEPLAY_SELECT":
						studentActions.$gadget
							.delegate( ".blueButton", "click", $.proxy(this.manageRolePlaySelection, this.target) );
					break;
				case "ROLEPLAY":
						studentActions.$gadget
							.delegate( ".block_buttons", "click", $.proxy(this.manageRolePlayProcess, this.target) );
				default: 
						studentActions.$gadget
							.delegate( "#arrows", "click", $.proxy(this.managePaginateWidgetButtons, this.target) );
					break;
			}
		},
		manageRolePlaySelection: function(event){
			var $target = $(event.target);
			var $buttonTarget = $target.closest(".blueButton");
			var sRole = $buttonTarget.attr("id");
			
			ABA_env.resetRolePlay();
			ABA_env.setRoleRecord(sRole);

			var $otherRoles = studentActions.$gadget.find(".blueButton").not($buttonTarget);
			$otherRoles.each(function(){
				sRole = $otherRoles.attr("id");
				ABA_env.setRolePlay(sRole);
			});
			
			masterActions.jumpSection("ROLEPLAY");
		},
		refreshNumberQuestions: function(number){
			studentActions.$gadget.find("#numberQuestions").html(number);
			Cufon.refresh();
		},
		getNumberQuestions: function(){
			return studentActions.config.numberQuestions;
		},
		setNumberQuestions: function(number){
			studentActions.config.numberQuestions = number;
		},
		// TODO: set minitestActions encapsulate
		manageCheckButtonClick: function(event){
			minitestActions.valida(studentActions.$gadget);			
		},
		loadAllTooltips: function(){
			$.each(studentActions.config.tooltipParams, function(){
				studentActions.$gadget.find("."+this.tooltipStarterClass).tooltp_init(this);
			});
		},
		manageRolePlayProcess: function(event){
			var $target = $(event.target);
			var $buttonPress =  $target.closest(".block_buttons");
			var sAction = $buttonPress.attr("action");
			ABA_utils.cancelBubble(event);
		
			$otherButtons = studentActions.$gadget.find(".block_buttons").not($buttonPress);
			switch(sAction){
				case "startRole":
					$buttonPress.addClass(studentActions.config.selectedClass);
					studentActions.disableBlockTextButton($otherButtons);
					studentActions.nextStepRolePlayProccess();
					$buttonPress.attr("action","stopRole");
					$buttonPress.find("[text='start']").hide();
					$buttonPress.find("[text='stop']").show();
					break;
				case "stopRole":
					$buttonPress.removeClass(studentActions.config.selectedClass);
					studentActions.enableBlockTextButton($otherButtons);
					studentActions.stopRolePlayProccess();
					$buttonPress.attr("action","startRole");
					$buttonPress.find("[text='stop']").hide();
					$buttonPress.find("[text='start']").show();
					break;
				case "startPlay":
					$buttonPress.addClass(studentActions.config.selectedClass);
					studentActions.disableBlockTextButton($otherButtons);
					studentActions.nextStepRolePlayProccess();
					$buttonPress.attr("action","stopPlay");
					$buttonPress.find("[text='start']").hide();
					$buttonPress.find("[text='stop']").show();
					break;
				case "stopPlay":
					$buttonPress.removeClass(studentActions.config.selectedClass);
					studentActions.enableBlockTextButton($otherButtons);
					studentActions.stopRolePlayProccess();
					$buttonPress.attr("action","startPlay");
					$buttonPress.find("[text='stop']").hide();
					$buttonPress.find("[text='start']").show();
					break;
			}
			
		},
		disableBlockTextButton: function($target){
			
			if(!$target.hasClass("disable")){
				var sAction = $target.attr("action");
				$target.attr("action","none");
				$target.attr("memoaction",sAction);
				$target.addClass("disable");
			}
		},
		enableBlockTextButton: function($target){
			
			var isAnyBlockRecorded = false;
			var $blockRecorded = studentActions.$gadget.find(".recordRole.rolePlayStepComplete");
			
			if($blockRecorded.size()>0){
				isAnyBlockRecorded = true;
			}
			
			if($target.hasClass("disable")){
				
				var sAction = $target.attr("memoaction");
				if(sAction == ""){
					// TODO: MAKE AND QUERY WITH isAnyBlockRecorded AND sAction
				}
					
				$target.attr("action",sAction);
				$target.removeClass("disable");

			} 
			
		},
		
		nextStepRolePlayProccess: function(){
			$buttonPress = studentActions.$gadget.find(".block_buttons").filter("."+studentActions.config.selectedClass);
			var sMode = $buttonPress.attr("id");
			
			if (sMode!=undefined) {
				
					var $workingListener = studentActions.$gadget.find(".listenerTooltip");
					var $nextStep = studentActions.$gadget.find("[role]").not("."+studentActions.config.classStepComplete).eq(0);
					var sRole = $nextStep.attr("role");
					
					if(sRole!=undefined){
						
						$.each(studentActions.config.tooltipParams, function(){
							
								switch(sMode){
									case "RoleButton":
											
										if ($nextStep.hasClass(this.tooltipStarterClass)){
											
											var extendedOptions = {};
											extendedOptions.serverOriginAudio = "demo";
											
											$nextStep.tooltp_init( $.extend(this,extendedOptions) );
										}
										
										break;
									case "playButton":
										
										if(this.tooltipStarterClass == "playRole"){
											var extendedOptions = {};
											
											if($nextStep.hasClass(studentActions.config.recordRoleClass)){
												extendedOptions.serverOriginAudio = "student";
											} else {
												extendedOptions.serverOriginAudio = "demo";
											}
											
											$nextStep.tooltp_init( $.extend(this,extendedOptions) );
										}
										
										break;
								}
			
							
						});
						
						$nextStep.click();
						$nextStep.addClass(studentActions.config.classStepComplete);
						$workingListener.tooltp_Unbind();
						
					} else {
						
						$buttonPress.click();
						
					}
			
			}
			
		},
	
		stopRolePlayProccess: function(){
			var $workingListener = studentActions.$gadget.find(".listenerTooltip");
			var $ElementsStep = studentActions.$gadget.find("[role]");
			$ElementsStep.removeClass(studentActions.config.classStepComplete);
			$notebook = $ElementsStep.closest("#notebook");
			$.fn.tooltp_deleteTooltip($notebook);
			$workingListener.tooltp_Unbind();
		},
		
		attachListenerUnitReady: function(){
			var sSectionUnit = null;
			$.subscribe("/unitEvents/unitReady", function(event) { 
  				sSectionUnit = ABA_env.getSection();
  				if (sSectionUnit=="ROLEPLAY"){
  					sSectionUnit="ROLEPLAY_SELECT";
  				}
	  			masterActions.setStepBreadCrumb(sSectionUnit);
	  			$.unsubscribe("/unitEvents/unitReady");
			});	
		},
	
		notifyUnitReady: function(){
			$.publish("/unitEvents/unitReady"); 
		},
		
		deleteInputKeyboardEvent: function(event){
			var $target = $(event.target);
			$target.unbind('keypress');
		},
		
		validateInputText: function(inputId , okText , filename){
			var $inputTarget = studentActions.$gadget.find("#"+inputId);
			var isTextOK = null;
			var textTrimmed = ABA_utils.trim( $inputTarget.val() );
			var sSection =  ABA_env.getSection();
			
			studentActions.removeRolloverClasses($inputTarget);
			
			if(  textTrimmed != "" ){
					isTextOK = ABA_utils.doValidate($inputTarget.val(),okText);
					
					switch (sSection){
						case "DICTATION":
							PROXY_env.HTMLSetDictationItemValue( inputId , filename , isTextOK, $inputTarget.val() );
							break;
						case "WRITING":
							PROXY_env.HTMLSetExerciseItemValue( inputId ,filename, isTextOK, $inputTarget.val() );
							break;
					}
					
					if(isTextOK){
						studentActions.markInputAsOK($inputTarget);
						return true;
					} else {
						studentActions.markInputAsNOOK($inputTarget);
						return false;
					}
					
			}	else   {
					studentActions.notMarkInput($inputTarget);
					return false;
			}
			
		},
		
		removeRolloverClasses: function($target){
			$target.removeClass("colorBackgroundHover");
			$target.removeClass("colorBackgroundHoverInputNOOk");
			$target.removeClass("colorBackgroundHoverInputOk");
		},

		notMarkInput: function($inputTarget){
			var $store = $inputTarget;
			$inputTarget.removeClass("inputOk");
			$inputTarget.removeClass("inputNook");
			$store.data("inputOk",null);
		},
		
		markInputAsOK: function($inputTarget){
			var $store = $inputTarget;
			$inputTarget.removeClass("inputNook");
			$inputTarget.addClass("inputOk");
			$store.data("inputOk",true);
		},
		
		markInputAsNOOK: function($inputTarget){
			var $store = $inputTarget;
			$inputTarget.removeClass("inputOk");
			$inputTarget.addClass("inputNook");
			$store.data("inputOk",false);
		},
		
		getUsername: function(){
			return PROXY_env.getUsernameProxy();
		},
		
		getMicroPermission: function(){
			return parent.masterActions.getMicroPermission();
		},
		cueStopHearing: function(){
			// current link active and rebuild memo
			var $tooltipHolders = studentActions.$gadget.find("."+studentActions.config.generalTooltipClass);
			
			$tooltipHolders.each(function(){
				
				var linkId = $(this).attr("linkid");
				
				var $store = $("#"+linkId);
				var memo = $("#"+linkId).data();
				
				var sTooltipClicked = memo.tooltipCLicked;
				var sCompareState = memo.compareState;
				$store.data("cueFromServer",true);
								
				// rebuild target and event for call function event
				if ( (memo.tooltipCLicked!=null) && (memo.tooltipCLicked!=undefined) ) {
					$target = $(this).find("#"+memo.tooltipCLicked);
					$target.click();
					if(sTooltipClicked=="compare" && sCompareState!="step2"){
						iconTimeoutCompare = setTimeout(function(){$target.click();}, 100);
					}
				}
				
			});
		},
		
		startPlay: function(filename,audioType,listenType){
			PROXY_env.HTMLListenElement(filename,audioType,listenType);
		},
		
		stopElement: function(inNotify){
			PROXY_env.HTMLStopElement(inNotify);
		},
		
		startRecord: function(filename){
					if(studentActions.getMicroPermission){
						PROXY_env.HTMLRecordElement(filename);						
					} else {
						// TODO: TRIGGER ERROR window
					}
		},
		
		loadMemoAudioListened: function(data){
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			var sSection =  ABA_env.getSection();
			var nQuest = studentActions.getNumberQuestions();
			$.each(data.Values, function(){
					var $store = studentActions.$gadget.find("[filename='"+this+"']");
					var memo = studentActions.$gadget.find("[filename='"+this+"']").data();
					if(memo!=undefined){
						var linkId = studentActions.$gadget.find("[filename='"+this+"']").attr("id");
					
						switch(sSection){
							case "WRITING":
							case "GRAMMAR":
									$store.data("hearMade",true);
									studentActions.$gadget.find("#"+linkId+":not(input)").css("text-decoration","underline");
								break;
							case "NEWWORDS":
								$store.data("hearMade",true);
								if(memo.recordMade){
									$store.data("compareMade",true);
									studentActions.$gadget.find("#"+linkId+":not(input)").css("text-decoration","underline");
									nQuest++;
								}
								break;
							case "ROLEPLAY":
								if(memo.recordMade){
									studentActions.$gadget.find("#"+linkId+".recordRole:not(input)").css("text-decoration","underline");
								}
								break;
							default:
								$store.data("hearMade",true);
								if(memo.recordMade){
									$store.data("compareMade",true);
									studentActions.$gadget.find("#"+linkId+":not(input)").css("text-decoration","underline");
								}
								break;
						}
						
					}
			});
			
			switch(sSection){
				case "NEWWORDS":
					studentActions.setNumberQuestions(nQuest);
					studentActions.refreshNumberQuestions(nQuest);
				break;
			}
			
		},
		
		loadMemoAudioRecorded: function(data){
				studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
				var sSection =  ABA_env.getSection();
				var nQuest = studentActions.getNumberQuestions();
				
				$.each(data.Values, function(){
						var $store = studentActions.$gadget.find("[filename='"+this+"']");
						var memo = studentActions.$gadget.find("[filename='"+this+"']").data();
						if(memo!=undefined){
							var linkId = studentActions.$gadget.find("[filename='"+this+"']").attr("id");
							
							switch(sSection){
								case "ROLEPLAY":
									$store.data("recordMade",true);
									studentActions.enableBlockTextButton( studentActions.$gadget.find("#playButton") );
									if(memo.hearMade){
										studentActions.$gadget.find("#"+linkId+".recordRole:not(input)").css("text-decoration","underline");
									}
								break;
								default:
									$store.data("recordMade",true);
									if(memo.hearMade){
										$store.data("compareMade",true);
										studentActions.$gadget.find("#"+linkId+":not(input)").css("text-decoration","underline");
									}
								break;
							}
				
						}
						
				});	
				
				switch(sSection){
					case "NEWWORDS":
						studentActions.setNumberQuestions(nQuest);
						studentActions.refreshNumberQuestions(nQuest);
					break;
				}

		},
		
		loadMemoInputText: function(data){
		
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			$.each(data.Values, function(){
				var sFile = this.file;
				var $store = studentActions.$gadget.find("[filename='"+sFile+"']");
				var memo = studentActions.$gadget.find("[filename='"+sFile+"']").data();
				if(memo!=undefined){
					var $inputTarget = studentActions.$gadget.find("[filename='"+sFile+"']");
						studentActions.markInputAsOK($inputTarget);
						$inputTarget.val($inputTarget.attr("text").replace(/\\'/g, "'"));
						$store.data("compareMade",true);
				}
			});
		},
		
		loadMemoInputTextFalse: function(data){
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			$.each(data.Values, function(){
				var sFile = this.file;
				var sText = this.text;
				var memo = studentActions.$gadget.find("[filename='"+sFile+"']").data();
				if(memo!=undefined){
					var $inputTarget = studentActions.$gadget.find("[filename='"+sFile+"']");
					if(sText!=""){
						studentActions.markInputAsNOOK($inputTarget);
						$inputTarget.val(sText.replace(/\\'/g, "'") );
					}
				}
			});
		},
		
		loadMemoWritingInputText: function(data){
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			$.each(data.Values, function(){
				var sFile = this.file;
				var nId = this.id;
				var $store = studentActions.$gadget.find("[filename='"+sFile+"']").filter("#"+nId);
				var memo = studentActions.$gadget.find("[filename='"+sFile+"']").filter("#"+nId).data();
				if(memo!=undefined){
					var $inputTarget = studentActions.$gadget.find("[filename='"+sFile+"']").filter("#"+nId);
						studentActions.markInputAsOK($inputTarget);
						$inputTarget.val($inputTarget.attr("text").replace(/\\'/g, "'"));
						$store.data("compareMade",true);
                                                $inputTarget.closest("."+memo.tooltipWritingAudioType).css("text-decoration","underline");                               
				}
			});
		},
		
		loadMemoWritingInputTextFalse: function(data){
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			$.each(data.Values, function(){
				var sFile = this.file;
				var sText = this.text;
				var nId = this.id;
				var memo = studentActions.$gadget.find("[filename='"+sFile+"']").filter("#"+nId).data();
				if(memo!=undefined){
					var $inputTarget = studentActions.$gadget.find("[filename='"+sFile+"']").filter("#"+nId);
					if(sText!=""){
						studentActions.markInputAsNOOK($inputTarget);
						$inputTarget.val(sText.replace(/\\'/g, "'"));
					}
				}
			});
		},
		
		
		loadMemoDataMinitest: function(data){
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			var quest = data.Values[0].responses.split(",");

			$collectionQuest = studentActions.$gadget.find(".column_right");
		
			$.each(quest, function(index){
				var nQuest = $collectionQuest.eq(index);
				var $target= nQuest.find("input[value='"+this+"']");
				var memo = $target.data();
				var $store = $target;
//				alert(this);
				if(memo!=undefined){
					$store.data("isClicked",true);
					$target.attr("checked","checked");
				}
				});
		},
		
		
		loadPaginateWidget: function(){
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			var $gadget = studentActions.$gadget;
			var sPreviousOne = ABA_env.getPreviousPage();
			var sNextOne = ABA_env.getNextPage();
			var sStep = String(ABA_env.getInxPageSection());
			var sTotalSteps = String(ABA_env.getTotalPagesSection());

			var $widget = $('<div id="arrows"></div>');
			if( (sPreviousOne!=undefined) && (sPreviousOne!=null) && (sPreviousOne!="") ){
				$widget.append('<img alt="left arrow" src="images/left_arrow.png" id="previous" page="'+sPreviousOne+'" class="left_arrow left"/>');
			}
			if( (sNextOne!=undefined) && (sNextOne!=null)  && (sNextOne!="") ){
				$widget.append('<img alt="right arrow" src="images/right_arrow.png" id="next" page="'+sNextOne+'" class="right"/>');
			}
			$widget.append('<p class="pag"><span class="f5">' + studentActions.config.steepText +'</span> <span  class="f6">'+sStep+'</span><span class="f5">/'+sTotalSteps+'</span></p>');
			$gadget.find("#notebook_footer").append($widget);
			studentActions.loadCufon();
		},
		
		
		managePaginateWidgetButtons: function(event){
			var $target = $(event.target);
			var sIdPaginate = $target.attr("id");
			var sPage = $target.attr("page"); 
			
			switch(sIdPaginate){
				case "previous":
				case "next":
						masterActions.loadUnit(sPage);
					break;
			}
		},
		
		loadPaginateWidgetMinitestCase: function(){
			
			studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
			var $gadget = studentActions.$gadget;
			var sCurrentPage = $gadget.find("#questions").children().eq(0).attr("id");
			var sPrefixCurrentPage = sCurrentPage.substr(0,5);
			
			var nCurrentPage = parseInt( sCurrentPage.substr(5,6) );			
			var nPreviousOne = nCurrentPage-1;
			var nNextOne 	 = nCurrentPage+1;
		
			var sPreviousOne = sPrefixCurrentPage+nPreviousOne.toString();
			var sNextOne 	 = sPrefixCurrentPage+nNextOne.toString();
			var sStep 		 = nCurrentPage;
			var sTotalSteps  = $gadget.find("#questions").children().size();
			
			var $widget = $('<div id="arrows"></div>');
			if( (sPreviousOne!=undefined) && (sPreviousOne!=null) && (sPreviousOne!="") ){
				$widget.append('<img id="previous" alt="left arrow" src="images/left_arrow.png" id="previous" page="'+sPreviousOne+'" class="left_arrow left"/>');
			}
			if( (sNextOne!=undefined) && (sNextOne!=null)  && (sNextOne!="") ){
				$widget.append('<img id="next" alt="right arrow" src="images/right_arrow.png" id="next" page="'+sNextOne+'" class="right"/>');
			}
			$widget.append('<p class="pag"><span class="f5">' + studentActions.config.steepText +'</span> <span  class="f6">'+sStep+'</span><span class="f5">/'+sTotalSteps+'</span></p>');
			$gadget.find("#notebook_footer").append($widget);
			studentActions.loadCufon();
		},
	
		managePaginateWidgetButtonsMinitestCase: function(event){
				var $target = $(event.target);
				var sIdPaginate = $target.attr("id");
				var sPage = $target.attr("page"); 
				switch(sIdPaginate){
					case "previous":
					case "next":
							studentActions.loadMinitestPage(sPage);
						break;
				}
		},
		
		
		loadMinitestPage: function(sPage){
			var $gadget = studentActions.$gadget;
			var sPrefixCurrentPage = sPage.substr(0,5);
			
			var nCurrentPage = parseInt( sPage.substr(5,6) );			
			var nPreviousOne = nCurrentPage-1;
			var nNextOne 	 = nCurrentPage+1;
		
			var sPreviousOne = sPrefixCurrentPage+nPreviousOne.toString();
			var sNextOne 	 = sPrefixCurrentPage+nNextOne.toString();
			var sStep 		 = nCurrentPage;
			var sTotalSteps  = $gadget.find("#questions").children().size();
			
			var jump = studentActions.$gadget.find("#questions > #"+sPage);
			
			if (jump.size()>0){
				studentActions.$gadget.find("#questions").children().hide();
				studentActions.$gadget.find("#questions > #"+sPage).show();
				studentActions.$gadget.find("#arrows #previous").attr("page",sPreviousOne);
				studentActions.$gadget.find("#arrows #next").attr("page",sNextOne);
				studentActions.$gadget.find("#arrows #step").html(sStep);
				studentActions.$gadget.find("#arrows #totalSteps").html(sTotalSteps);
				studentActions.loadCufon();
			}
		},
		
		manageCheckboxInput: function(event){
			
			var $target = $(event.target);
			var $store = $target;
			var memo = $store.data();
			
			var isClickedThis = memo.isClicked;
			
			$target.closest(".column_right").find("input[type='checkbox']").each(function(){
				var $store = $(this);
				var memo = $(this).data();
				
				if (memo.isClicked){
					$(this).removeAttr("checked");
					$store.data("isClicked",false);
				}
			});
			
			if (!isClickedThis){
				$target.attr("checked","checked");
				$store.data("isClicked",true);
			} else {
				$target.removeAttr("checked");
				$store.data("isClicked",false);
			}
			
		
			}
	
		
};