// fichero a incluir en la unidad  
var PROXY_env ={
	version:function(){alert("PROV_env 1.0");},
	getStrUnit:function (){
		var unit = ABA_env.getUnit();
		if(unit<10)	unit="00"+unit;	
		else if(unit<100) unit="0"+unit;
		return unit;
	},	
	setFilename:function(inFilename){
		ABA_env.setAudioFilename(inFilename);
	},
	getFilename:function(){
		return ABA_env.getAudioFilename();
	},
	getSection:function (){
		return ABA_env.getSection();
	},
	getPage:function ()
	{
		return ABA_env.getPage();
	},
	getUnit:function ()
	{
		return ABA_env.getUnit();
	},
	getIdLearner:function (){
		return ABA_env.getIdLearner();
	},
	getUsernameProxy:function(){
		return ABA_env.getUsername().replace(/\./g, "_");
	},
	getNumExerciseSection:function(){
		ABA_env.getExercises()[this.getSection()];
	},
	SWFHaveMicroPermission:function(){
		return masterActions.SWFGetPlayer().SWFHaveMicroPermission();
	},
	SWFToPlayer:function(inRequest){
		masterActions.SWFGetPlayer().toActionScript(inRequest);
	},
	SWFProxyDelayed:function(url_aba)
	{
		masterActions.SWFProxyDelayed(url_aba);
	},
	SWFStop:function()
	{
		masterActions.SWFGetPlayer().role_stop();
	},
	SWFProxy:function(url_aba){
		masterActions.SWFGetPlayer().SWFProxy(url_aba);
	},
	HTMLListenElement:function(id_audio,audioType,listen_type){
		var audioLocation ="0";
		var medialevel=0;
		
		this.setFilename(id_audio);	
		unit=this.getStrUnit();
		username=this.getUsernameProxy();
		
		if(listen_type=="student") {
			audioLocation=id_audio;
		}else{
			switch(audioType){
				case '2' :
				case '1' :
					if(Math.floor(eval(unit/12))==eval(unit/12)){
						medialevel = Math.floor(eval(unit/12));
					} else {
						medialevel = Math.floor(eval(unit/12))+1;
					}
					if(medialevel<10) audioLocation="mcd0"+medialevel+"/"+id_audio;	
					else audioLocation="mcd"+medialevel+"/"+id_audio;
					break;
				case '3' :
				case '4' :
					audioLocation="units/unit"+unit+"/audio/"+id_audio;
					break;	
			}
		}
		var param = "text:" + username + ":" + unit + ":" + audioLocation + ":" + listen_type;
	// 	alert("listen "+param);
		this.SWFToPlayer(param);
		if(listen_type=="demo"){
			var url_aba = "http://www.abaenglish.com/transactions/wsetUnitSectionEv.php?doecho=true&id_learner="+this.getIdLearner()+"&unit="+this.getUnit()+"&page="+this.getPage()+"&section="+this.getSection()+"&action=LISTENED&id_elem="+this.getFilename()+"&bien=1&mal=0&exercises="+this.getNumExerciseSection();
			this.SWFProxyDelayed(url_aba);
			
		}
	},
	HTMLStopElement:function(inNotify){
		this.SWFStop();
		//if we've recorded something, we keep the information in the database
		if(inNotify==true){
			var url_aba = "http://www.abaenglish.com/transactions/wsetUnitSectionEv.php?doecho=true&id_learner="+this.getIdLearner()+"&unit="+this.getUnit()+"&page="+this.getPage()+"&section="+this.getSection()+"&action=RECORDED&id_elem="+this.getFilename()+"&bien=1&mal=0&exercises="+this.getNumExerciseSection();
			this.SWFProxy(url_aba);
		}
	},
	HTMLRecordElement:function(id_audio){
		this.setFilename(id_audio);
		unit=this.getStrUnit();
		username=this.getUsernameProxy();
		var param = "text:" + username + ":" + unit + ":" + id_audio + ":record";
		this.SWFToPlayer(param);
	},
	HTMLNewPageInicial:function(){ // se invoca cuando se carga la pagina del curso para pedir los datos de actualización // 
		var url_aba = "http://www.abaenglish.com/transactions/wgetScormAllOnloadWithEval.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit()+"&page="+this.getPage()+"&section="+this.getSection()+"&login="+this.getUsernameProxy();
		this.SWFProxy(url_aba);
	},
	HTMLStopSituation:function(){
		var url_aba = "http://www.abaenglish.com/transactions/wsetSituationEv.php?doecho=true&id_learner="+this.getIdLearner()+"&unit="+this.getUnit();
		this.SWFProxy(url_aba);
	},
	HTMLStoreAnswer:function(){
		var url_aba = "http://www.abaenglish.com/transactions/wsetAnswerEv.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit()+"&section="+this.getSection();
		this.SWFProxy(url_aba);
	},
	HTMLSetDictationItemValue:function(inputId, audio, isOk, entry){
		var theStrState = "";
		var theWtextString = "";
		if(isOk){
			theStrState = "&bien=1&mal=0";
		} else {
			theStrState = "&bien=0&mal=1";
			theWtextString = "&wtext="+escape(entry);
		}
		var url_aba = "http://www.abaenglish.com/transactions/wsetUnitSectionEv.php?doecho=true&id_learner="+this.getIdLearner()+"&unit="+this.getUnit()+"&page="+this.getPage()+"&section="+this.getSection()+"&action=DICTATION&id_elem="+audio+theStrState+"&exercises="+inputId+theWtextString;
		this.SWFProxy(url_aba);
	},
	HTMLSetExerciseItemValue:function(id,audio,isOk,entry) {
		var theStrState = "";
		var theWtextString = "";
		if (isOk){
			theStrState = "&bien=1&mal=0";
		} else {
			theStrState = "&bien=0&mal=1";
			theWtextString = "&wtext="+escape(entry);
		}
		var url_aba = "http://www.abaenglish.com/transactions/wsetUnitSectionEv.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit()+
		"&page="+this.getPage()+"&section="+this.getSection()+"&action=WRITTEN&id_elem="+audio+"_"+id+theStrState+"&exercises="+
		this.getNumExerciseSection()+"&difficulty=1"+theWtextString;
		this.SWFProxy(url_aba);
	},
	HTMLExitPage: function(httphost,id_learner,unit){
		var tiempo;
		var abaplayerajax = "http://www.abaenglish.com/transactions/wsetExitPage.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit()+"&time="+tiempo;
		if(document.getElementById('SWFProxy')!=null) {
			SWFProxy(abaplayerajax);
		} else { 
			parent.SWFProxy(abaplayerajax);
		}

		if(typeof(semLogin) == "undefined") semLogin = parent.semLogin
		if (semLogin==1){
			if (parent.document.getElementById("theTime")){
				tiempo=parent.document.getElementById("theTime").value;
			}
			else tiempo ='NO';
			var abaplayerajax = "http://www.abaenglish.com/transactions/wsetExitPage.php?id_learner="+id_learner+"&unit="+unit+"&time="+tiempo;
			if(document.getElementById('SWFProxy')!=null) SWFProxy(abaplayerajax)
			else parent.SWFProxy(abaplayerajax)
		}
	},
    HTMLGetNewWords: function(){
        var url_aba = "http://www.abaenglish.com/transactions/wgetNewWords.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit();
        this.SWFProxy(url_aba);
    },
	HTMLGetScormStudentData:function(){
		var url_aba = "http://www.abaenglish.com/transactions/wgetScormStudentData.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit();
		this.SWFProxy(url_aba);
	},
	HTMLGetTimerUnitByUser:function(){	
		var url_aba = "http://www.abaenglish.com/transactions/wgetTimerFollowup.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit();
		this.SWFProxy(url_aba);
	}, 
	HTMLGetEvaluation:function(){
          var url_aba = "http://www.abaenglish.com/transactions/wgetEvaluation.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit();
          this.SWFProxy(url_aba);
	},
  	HTMLSetEvaluation:function(inPutuation, inExercises){
          var url_aba = "http://www.abaenglish.com/transactions/wsetEvaluation.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit()
          + "&exercises="+inExercises+"&puntuation="&inPuntuation;
          this.SWFProxy(url_aba);
  	}
};
