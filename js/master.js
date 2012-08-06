
function callConnectionOff(){
	masterActions.connectionOff();   
}
function callConnectionOn(){
    console.log("connectiion and flash ready");
	masterActions.connectionOn();
}
function callLogin(inResult){
    if(inResult != ""){
    	var result=inResult.split(":");
    	console.log("***************** ID *********************"+result[0]);
        ABA_env.setIdLearner(result[0]);
    }
    console.log("login ready");
}
function callConfirmed(){
	console.log("callConfirmed");
	masterActions.hideAbaPlayer();
	masterActions.notyfyLoginReady();
}  
function callConfirmation(){
	console.log("callConfirmation");
    masterActions.showPermissionConfirmation();
}
function callProxyResponse(inContent){   
	console.log("SERVER CALL");
    ABA_env.storeRequestData(inContent);
}
// callback functions
function callPlayEnd(){
	studentActions.cueStopHearing();
} 
function CallbackPlayFromControlAnimacion(){
	masterActions.SWFGetVideoPlayer().ABAPlayVideo();
}
function CallbackStopFromControlAnimacion(){
	masterActions.SWFGetVideoPlayer().ABAStopVideo();
}
function CallbackSubtitlesFromControlAnimacion(inLg){
	inLg = parseInt(inLg);
	switch(inLg){
		case 1:
			masterActions.SWFGetVideoPlayer().ABALgEnglish();
		break;
		case 2:
			masterActions.SWFGetVideoPlayer().ABALgNative();
		break;
		default:
			masterActions.SWFGetVideoPlayer().ABALgNone();
		break;
	}
}
function CallbackEndPlaySituation(){
		PROXY_env.HTMLStopSituation();
		masterActions.SWFGetVideoPlayer().playMode(); 
}
//////////////////////////////////ENDNEW FUNCTIONALITY///////////////////////

var masterActions = {
		version: function (){/*alert("masterActions v.1.0");*/},
		config: {
			identifier: "master",
			requiredMajorVersion: 9,
			requiredMinorVersion: 0,
			requiredRevision: 28,
			videoHolder: "#videoHolder",
			videoPlayerHolder: "#videoPlayerHolder", 
			pageIni: "unit01000111.html",
//			streamServer: "stream.abaenglish.com",
			streamServer: "stream2.abaenglish.com",
			flashIdentifier: "ABAPlayer2",
			arrSection: []
		},
		
		init: function( config ){
			//Adds data from the call to the options object
			masterActions.config = $.extend(masterActions.config, config);
						
			//Set-Up main properties
			masterActions.setupAjax();
			masterActions.setUpGadgetIdentifier(masterActions.config.identifier);
			masterActions.buildUi(masterActions.$gadget);
			masterActions.loadObserverEvents();
			masterActions.loadEvents();
		},
		
		 /**
		 * Set-Up of the gadget identifier
		 */
		setUpGadgetIdentifier: function (id){
			if (masterActions.config.identifier !== null){
				masterActions.$gadget = $("#" + id);
			}else{
				masterActions.$gadget = $("body");
			}
		},
		
		/**
		 * Load the events related to this gadget
		 */
		loadEvents: function(){
			masterActions.$gadget
				.delegate("#breadcrumb", "click", $.proxy(this.manageBreadCrumb, this.target) )
				.delegate("#breadcrum_text", "click", $.proxy(this.manageBreadCrumbText, this.target) );
		},
		
		/**
		 * Builds the initially required user interface elements
		 * @param $gadget
		 */
		buildUi: function ($gadget){
			masterActions.loadFlashObject();
			masterActions.loadCufon();
			masterActions.loadUnit(masterActions.config.pageIni);
//			masterActions.modalBox();
		},
		
		modalBox: function(){	
			$.fancybox("hola"); 
		},
				
		/**
		 * Load the Overserver events related to this gadget
		 */
		loadObserverEvents: function(){
			console.log("loadObserver");
			$.subscribe("/masterEvents/objFlashReady", function(event) { 
				var $store = masterActions.$gadget;
				$store.data("objectFlashReady",true);
				console.log("FIRE!!!!");
				initUnit();
			});	
		},
		
		setupAjax: function(){
			$.ajaxSetup({
				type: "POST",
				cache: false,
				async: true,
				success: function(){
				     $('#loadingWrapper').hide();
				  }
				});	
//			$("#loadingWrapper").ajaxStart(function(){
//				   $(this).show();
//				 });
//			$("#loadingWrapper").ajaxStop(function(){
//				   $(this).hide();
//				 });
		},
	
		/**
		 * Load the special fonts to this gadget
		 */
		loadCufon: function(){
			Cufon.replace(".f11");
			Cufon.replace(".f17");
			Cufon.replace(".f18");
			Cufon.replace(".f19");
			Cufon.replace(".f20");
			Cufon.replace(".f21");
			Cufon.replace(".f15");
			Cufon.now();
			masterActions.$gadget.find("#breadcrum_text .cufon").addClass("cufonBorder");
			masterActions.$gadget.find("#breadcrum_text .cufon").addClass("maxHeight");
		},
	
		
		manageBreadCrumbText: function(event){
//			masterActions.$gadget.find('#loadingWrapper').show();
			var $target = $(event.target);
			var $levelDomTarget = $target.closest("li");
			var sType = $levelDomTarget.attr("jump");
			masterActions.jumpSection(sType);
			Cufon.refresh();
		},

		manageBreadCrumb: function(event){
//			masterActions.$gadget.find('#loadingWrapper').show();
			var $target = $(event.target);
			var $levelDomTarget = $target.closest(".breadcrumbItem");
			var sType = $levelDomTarget.attr("id");
			masterActions.jumpSection(sType);
		},
		
		jumpSection: function(sSection){
			var arrBreadCrumb  = ABA_env.getFirstPages();
			console.log("targetBreadCrum:"+sSection);
			if( sSection in arrBreadCrumb ){
				masterActions.$gadget.find('#loadingWrapper').show();
				masterActions.loadUnit(arrBreadCrumb[sSection]);
			} else {
				// TRIGGER ERROR
			}
		},
		
		setStepBreadCrumb: function(sSection){
			console.log("setStepBreadCrumb:"+sSection);
			console.log(masterActions.$gadget);
			masterActions.$gadget.find(".breadcrum_selected").removeClass("breadcrum_selected");
			masterActions.$gadget.find(".breadCrumbTextSelected").removeClass("breadCrumbTextSelected").find(".cufon").addClass("cufonBorder");
			
			masterActions.$gadget.find("#"+sSection).addClass("breadcrum_selected");
			masterActions.$gadget.find("ul#breadcrum_text > li[jump='"+sSection+"']").addClass("breadCrumbTextSelected").find(".cufon").removeClass("cufonBorder");
			
			Cufon.refresh();
		},
		
		getMicroPermission : function(){
			return masterActions.$gadget.find("#"+studentActions.config.flashIdentifier).SWFHaveMicroPermission();
		},
		
		getIdLearner: function(){
			return ABA_env.getIdLearner();
		},
		
		getURIDoc: function (){
			var theAux = document.location.href;
			var thePos = theAux.indexOf("://");
			theAux = theAux.substr(thePos+3);
			thePos = theAux.lastIndexOf("/");
			theAux = theAux.substr(0, thePos+1);
			return theAux;	
		},
	
		getFlashAuxVar: function(){
			var data = { 
					urlServer: 	masterActions.config.streamServer,
					copyright: 	'false',
					comments: 	'off',
					html: 		'apl/',
					levelColor: '#EAEAEA',
					username: 	ABA_env.getUsername(),
					password: 	ABA_env.getPassword()
				};
			var result = decodeURIComponent($.param(data));
			return result;
		},
		
		getFlashAuxVarVideoPlayer: function(inUnit){
			var data = { 
					server: 	 		 ":"+masterActions.getURIDoc()+"situations/",
					subtitlesServer: 	 ":"+masterActions.getURIDoc()+"situations/",
					media: 				"unit"+inUnit+".flv",
					subtitlesMedia: 	"navigation"+inUnit+".xml",
					showSubs:			1,
					subbutton:			":"+masterActions.getURIDoc()+"situations/subtitlebutton.xml"
				};
			var result = decodeURIComponent($.param(data));
			return result;
		},
		
		detectFlashVer: function(){
			return DetectFlashVer(masterActions.config.requiredMajorVersion, masterActions.config.requiredMinorVersion, masterActions.config.requiredRevision);
		},
		
		connectionOff: function(){
			console.log("connectionoff");
			 masterActions.$gadget.find("#frameNoConnection").show();
		},
		
		connectionOn: function(){
			console.log("connectionon");
			 masterActions.$gadget.find("#frameNoConnection").hide();
		},
		
		SWFProxyDelayed: function(inUrl){
			 setTimeout("masterActions.SWFGetPlayer().SWFProxy('"+inUrl+"');",100);
		},
	
		SWFGetPlayer: function(){
			return document.getElementById(studentActions.config.flashIdentifier);
		},
		SWFGetVideoPlayer: function(){
			return document.getElementById('bsplayer');
		},
		
		hideAbaPlayer: function(){	
			 masterActions.$gadget.find("#videoHolder").css("height","0");
			 masterActions.$gadget.find("#"+studentActions.config.flashIdentifier).attr("height","0");
			 masterActions.$gadget.find("#"+studentActions.config.flashIdentifier).css("height","0");
			console.log("deleteplayer");
		},
		
		showPermissionConfirmation: function(){
			 masterActions.$gadget.find(masterActions.config.videoHolder).show();
			 masterActions.$gadget.find("#"+studentActions.config.flashIdentifier).show();	
			 masterActions.$gadget.find(masterActions.config.videoHolder).css("top","214px").css("left","146px");
			 masterActions.$gadget.find("#"+studentActions.config.flashIdentifier).attr("height","110px").attr("width","180px");
			 masterActions.$gadget.find(masterActions.config.videoHolder).addClass("microPermissionHolder");
			 masterActions.$gadget.find("#"+studentActions.config.flashIdentifier).addClass("microPermission");
			console.log("showingconfirmation");
		},
	
		loadVideoPlayer: function(inUnit){
			 var flashObj =  null;
			 
			 if (masterActions.detectFlashVer()) {
				  flashObj = AC_FL_RunContent(
						    "src", "bsplayer",
							"allowFullScreen", "true",
							"width", 664,//686,
							"height", 502,//532, 
							"align", "middle",
							"id", "bsplayer",
							"quality", "high",
							"bgcolor", "#ffffff",
							"name", "bsplayer",
							"allowScriptAccess","sameDomain",
							"type", "application/x-shockwave-flash",
							"pluginspage", "http://www.adobe.com/go/getflashplayer",
				  			"flashvars",	masterActions.getFlashAuxVarVideoPlayer(inUnit)
							);
		  } else {  
			 // flash is too old or we can't detect the plugin
		    document.location.href ="flash/getFlash_es.html";
		  }
			 masterActions.$gadget.find(masterActions.config.videoPlayerHolder).append(flashObj);					
		},
		loadFlashObject: function(){
			 var flashObj =  null;
			 console.log("loading ajax object");
			 if (masterActions.detectFlashVer()) {
				  flashObj = AC_FL_RunContent(
							"src", 				"ABAPlayer2",			
							"position", 		"absolute",
							"width",			"660",
							"height", 			"0",
							"align", 			"middle",
							"id", 				studentActions.config.flashIdentifier,
							"quality", 			"high",
							"bgcolor", 			"#8f8f8f",
							"name", 			studentActions.config.flashIdentifier,
							"allowScriptAccess","always",
							"type", 			"application/x-shockwave-flash",
							"pluginspage", 		"http://www.adobe.com/go/getflashplayer", 
							"flashvars",		 masterActions.getFlashAuxVar()
							);
		  } else {  
			 // flash is too old or we can't detect the plugin
			 // trigger error
		    document.location.href ="flash/getFlash_es.html";
		  }
			 masterActions.$gadget.find(masterActions.config.videoHolder).append(flashObj);
		
		},
		
		notyfyLoginReady: function(){
			$.publish("/masterEvents/objFlashReady"); 
		},
		
		getMaxPage: function(){
			return ABA_env.getMaxPage();
		},
		
		loadInfoProgressBar: function(data){
				console.log("loadInfoProgressBar");
				console.log(data);
				studentActions.setUpGadgetIdentifier(studentActions.config.identifier);
				var sum = 0;
				var nIndex = 0;
				$.each(data.Values, function(index){
					console.log("new bar");
					console.log(parseInt(this));
					var nPercent = parseInt(this);
					console.log(nPercent);
					sum += nPercent;
					nIndex++;
					var graphicValue = Math.round( nPercent / 2 );
					masterActions.$gadget.find(".progressBar").eq(index).css("width",graphicValue);
				});	
				var ntotalPercent = sum / nIndex;
//				alert(sum);
//				alert(nIndex);
		},
		
		loadUnit: function(sPage){
			
			masterActions.setUpGadgetIdentifier(masterActions.config.identifier);
			var $gadget = masterActions.$gadget;
			var $window = $gadget.find("#thisUnit");
			var sAction = null;
			
			if( (sPage == undefined) || (sPage == null) ){
				sAction = $window.attr("src");
			} else {
				sAction = sPage;
			}
			
			delete studentActions;
			
			console.log("jump!!!!-->"+sAction);
			$window.load(sAction,
					  function(response, status, xhr){
						  	switch(status){
						  		case "error":
						  			// trigger error
						  		break;
						  		default:
						  			var memo =   masterActions.$gadget.data();
						  			console.log("!!!!!!!!!!!!!JUMPED!!!!!!!!!!!"+sPage+"");
						  			if(memo.objectFlashReady){
						  				console.log("objectflashready: true");
						  				initUnit();
						  			}
						  			
						  		break;
						  	}
							
					  });
			
		}
	
};
