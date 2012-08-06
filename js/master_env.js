var SCO_env =
{
	delay: 2000,
	interval: 30000,
	mSCORM_CourseTimer: 0, 
	completed: false,
	SCO_startTime: 0,	
	SCO_sec: 0,
	SCO_min: 0,
	SCO_hour: 0,
	initScormTimer: function(){
		if (LMSIsInitialized()){
			doLMSSetValue("cmi.core.session_time","0000:00:00.00");
			this.mSCORM_CourseTimer = new ABA_timer(this.delay, this.interval, this._callbackTimer, this);
			this.mSCORM_CourseTimer.start();
			return true;
		}
		return false;
	},
	_callbackTimer:function(inObj)  
	{
		if(inObj.updateActualTimerMoodle()){
		   doLMSCommit();
		}
	},
	setSuspendData:function (inData, inDoCommit)
	{
		if (LMSIsInitialized()){	
			doLMSSetValue("cmi.suspend_data",inData);
			if(inDoCommit)
				doLMSCommit();
			return true;
		}
		return false;	
	},
	getSuspendData: function(){
		if (LMSIsInitialized()) 
		 return doLMSGetValue("cmi.suspend_data");
		return ""; 
	},
	getProgress:function ()	{
		var thePercentaje = 0;
		if (LMSIsInitialized()){
			thePercentaje=doLMSGetValue("cmi.core.score.raw");
			if(thePercentaje>=100)
				this.completed=true;
			else	
				this.completed=false;
		}
		return thePercentaje;
	},
	setProgress:function(inPercent){
		if (LMSIsInitialized()){
			if(inPercent >=100){
				inPercent =100;
				this.completed =true;
			}	
			doLMSSetValue("cmi.core.score.raw",inPercent);
			doLMSSetValue("cmi.core.score.max",100);
			doLMSCommit();
			return true;
		}
		return false;
	},
	updateActualTimerMoodle:function(){
		var tDiff=(SCO_hour*3600)+(SCO_min*60)+SCO_sec;
		if(SCO_startTime==null) SCO_startTime=tDiff;
		
		var timeaux= tDiff - SCO_startTime;	  
		var hours=parseInt((timeaux/3600),10);
		var minutes=(parseInt((timeaux/60),10))%60;
		var seconds=timeaux%60;
		
		if (hours/10<1) hours = "0" + hours;
		if (minutes/10<1) minutes = "0" + minutes;
		if (seconds/10<1) seconds = "0" + seconds;
		   
		var scormDate = hours + ":" + minutes + ":" + seconds + ".00";	
		if (LMSIsInitialized()){
			   doLMSSetValue("cmi.core.session_time",scormDate);
			return true;
		}
		return false; 
	},
	Exit:function (){//al salir de la unidad verificar guardar datos
		if (LMSIsInitialized()){
			var score = doLMSGetValue("cmi.core.score.raw");
			this.mSCORM_CourseTimer.stop();
			this.updateActualTimerMoodle();
			if (doLMSGetValue("cmi.core.lesson_mode")=="browse") doLMSSetValue("cmi.core.lesson_status","browsed");
			else{ 
				if (this.completed==true) doLMSSetValue("cmi.core.lesson_status","completed");
				else doLMSSetValue("cmi.core.lesson_status","incomplete");
			}
			doLMSCommit();
			doLMSFinish('');
		}	
	},
	initUsernameSession: function()
	{
		doLMSInitialize('');
		if (LMSIsInitialized())
			return doLMSGetValue("cmi.core.student_id");
		return "";	
	}	
};

////////////////////////////////////////////////////////////
var ABA_env = {
	version: function (){/*alert("ABA_env v.1.0");*/},
	MyData:  new Array(),
	MyDataFollowUp: new Array(),
	MyDataAll: new Array(),
	MyDataListened: new Array(),
	MyDataRecorded: new Array(),
	MyDataDictation: new Array(),
	MyDataWriting: new Array(),
	exercises: new Array(),
	firstPages: new Array(),
	breadCrumbMap: new Array(),
	arrLevel:  
		[ "Beguinners",
		  "Lower Intermediate",
		  "Intermediate",
		  "Upper Intermediate",
		  "Advanced",
		  "Business" ],
	Course_totalTime: 0,
	mABA_CourseTimer: 0,
	
	////////////////////////////////////////////
	unitG: 0,
	id_learnerG: -1,
	usernameAP: "", 
	passwordAP: "", 
	audioFilenameG: "",
	sectionG: "", 
	pageG: 0,
	levelG: 0,
	inxPageG:0,
	previousP:"",
	nextP:"",
	inxPageSection: 0,
	totalPagesSection: 0,
	rolePlay: [],
	roleRec: "",
	///////////////////////////////////////////
	
	initCourseTimer: function(inUnixtime){
		this.Course_totalTime = inUnixtime;
		this.mABA_CourseTimer = new ABA_timer(2000, 60000, this._callbackTimer, this);
		this.mABA_CourseTimer.start();
	},
	getTotalTime: function(){
		return this.Course_totalTime;
	},
	_callbackTimer: function(inObj)	{
		inObj.Course_totalTime++; 
	},
	resetRolePlay: function(){
		this.rolePlay = [];
	},
	setRolePlay: function(char){
		this.rolePlay.push(char);
	},
	getRolePlay: function(){
		return this.rolePlay;
	},
	setRoleRecord: function(char){
		this.roleRec = char;
	},
	getRoleRecord: function(){
		return this.roleRec;
	},
	setInxPageSection: function(inInx){
		this.inxPageSection=inInx;
	},
	getInxPageSection: function(){
		return this.inxPageSection;
	},
	setTotalPagesSection: function(inTotal){
		this.totalPagesSection=inTotal;
	},
	getTotalPagesSection: function(){
		return this.totalPagesSection;
	},
	setNextPage: function(inPage){
		this.nextP=inPage;
	},
	getNextPage: function(){
		return this.nextP;
	},
	setPreviousPage: function(inPage){
		this.previousP=inPage;
	},
	getPreviousPage: function(){
		return this.previousP;
	},
	setUnit: function(inUnit){
		this.unitG=inUnit;
	},
	getUnit: function(){
		return this.unitG;
	},
	setIdLearner: function(inIdLearner){
		this.id_learnerG = inIdLearner;
	},
	getIdLearner: function(){
		return this.id_learnerG;
	},
	setPassword: function(inPassword){
		this.passwordAP=inPassword;
	},
	getPassword: function(){
		return this.passwordAP;
	},
	setUsername: function(inUsername){
		this.usernameAP=inUsername;
	},
	getUsername: function(){
		return this.usernameAP;
	},
	setAudioFilename: function(inFilename){
		this.audioFilenameG=inFilename;
	},
	getAudioFilename: function(){
		return this.audioFilenameG;
	},
	setSection: function(inSection){
		this.sectionG=inSection;
	},
	getSection: function(){
		return this.sectionG;
	},
	setInxPage: function(inPage){
		this.inxPageG=inPage;
	},
	getInxPage: function(){
		return this.inxPageG;
	},
	setPage: function(inPage){
		this.pageG=inPage;
	},
	getPage: function(){
		return this.pageG;
	},
	setLevel: function(inLevel){
		this.levelG=inLevel;
	},
	getLevel: function(){
		return this.levelG;
	},
	getStringLevel: function(){
		var sTemp = getLevel();
		return this.arrLevel[sTemp];
	},
	setFirstPages: function(inFirstPages){
		this.firstPages=inFirstPages;
	},
	getFirstPages: function(){
		return this.firstPages;
	},
	///////////////// poner getters
	setExercises: function(inExercises){
		this.exercises=inExercises;
	},
	getExercises: function(){
		return this.exercises;
	},
	resetEnv: function(){
		this.MyData = new Array();
		this.MyDataFollowUp = new Array();
		this.MyDataAll = new Array();
		this.MyDataListened = new Array();
		this.MyDataRecorded = new Array();
		this.MyDataDictation = new Array();
		this.MyDataWriting = new Array();
		this.exercises = new Array();
	},
//	getTimerUnitByUser:function(){	
//		var url_aba = "http://www.abaenglish.com/transactions/wgetTimerFollowup.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit();
//		masterActions.SWFGetPlayer().SWFProxy(url_aba);
//	},	
	/*
	loadScormStudendData:function() {
		var url_aba = "http://www.abaenglish.com/transactions/wgetScormStudentData.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit();
		masterActions.SWFGetPlayer().SWFProxy(url_aba);
	},
	*/
//	loadScormAllOnload:function() {
//		//id_learner unit page section
//		var url_aba = "http://www.abaenglish.com/transactions/wgetScormAllOnload.php?id_learner="+this.getIdLearner()+"&unit="+this.getUnit()+"&page="+this.getPage()+"&section="+this.getSection();
//		console.log("SWFProxy DATA REQUEST: "+url_aba);
//		masterActions.SWFGetPlayer().SWFProxy(url_aba);
//	},
	responseSetUnitSectionEv: function (text_array){
		var porcentajes=text_array[2]; 
		masterActions.loadInfoProgressBar(this.dispacher("DataAll", porcentajes));
//		this.loadScormStudendData(); 
	},
	dispacher: function(dataType,strData){
		console.log("**DISPACHER**");
		var arrData = strData.split(";");
		var temp = null;
		console.log("DATA1");
		console.log(arrData);
//		 build JSON define structure
		var data = {};
		data.Type = dataType;
		data.Values = [];

//		 build JSON push array values
		switch(dataType){
			case "DataListened":
			case "DataRecorded":
			case "DataAll":
				for(var i = 0, l = arrData.length; i < l; i++) {
					data.Values.push(arrData[i]);
				}
				break;
			case "DataQuest":
				for(var i = 0, l = arrData.length; i < l; i+=2) {
					data.Values.push({
						"score": arrData[i],
						"responses": arrData[i+1] 
					});
				}
				break;
			case "dataDictationFalse":
				for(var i = 1, l = arrData.length; i < l; i+=2) {
					data.Values.push( {
									"file": arrData[i],
									"text": arrData[i+1] 
					});
				}
				break;
			case "dataWritingFalse":
				for(var i = 1, l = arrData.length; i < l; i+=3) {
					temp =  arrData[i].split("_");
					data.Values.push( {
									"file": temp[0],
									"id":	temp[1],
									"text": arrData[i+2] 
					});
				}
				break;
			case "dataDictation":
				for(var i = 1, l = arrData.length; i < l; i++) {
					data.Values.push({
									"file": arrData[i] 
					});
				}
				break;
			case "dataWriting":
				for(var i = 1, l = arrData.length; i < l; i++) {
					temp =  arrData[i].split("_");
					data.Values.push({
								"file": temp[0],
								"id":	temp[1]
					});
				}
				break;
		}
		
		return data;
		console.log(data);
	},
	
	//2;SITUATION;jperezmarweb_at_gmail_com;
	//A;2491;2;779;2012-04-26 15:52:45;24;6;18;275;100;14;38;8;4;25;1;0;0;5;3;2;4;8;7 --------->MyDataAll
	//L; --------->DataListened
	//R; --------->DataRecorded
	//D; --------->MyDataDictation
	//W; --------->DataWriting
	//WF;--------->DataWritingFalse
	//DF;--------->MyDataDictationFalse
	
	responseGetScormAllOnload: function(text_array){
		this.MyDataAll = text_array[2];
		this.MyDataListened = text_array[3];
		this.MyDataRecorded = text_array[4];
		this.MyDataDictation = text_array[5];
		this.MyDataWriting = text_array[6];	
		this.MyDataWritingFalse = text_array[7];
		this.MyDataDictationFalse = text_array[8];
		this.MyDataMinitest = text_array[2];
		console.log("dispacher: executing switch");
		console.log(text_array);
					
		switch(this.getSection()){
			case "MINITEST":
				studentActions.loadMemoDataMinitest(  this.dispacher("DataQuest", this.MyDataMinitest)  );	
			break;
			case "ROLEPLAY":
				studentActions.loadMemoAudioRecorded(  this.dispacher("DataRecorded", this.MyDataRecorded)  );	
				studentActions.loadMemoAudioListened(  this.dispacher("DataListened", this.MyDataListened)  );
			break;
			case "WRITING":
				console.log("dispacher info in WRITING");
				studentActions.loadMemoWritingInputTextFalse(  this.dispacher("dataWritingFalse", this.MyDataWritingFalse)  );	
				studentActions.loadMemoWritingInputText(  this.dispacher("dataWriting", this.MyDataWriting)  );
				studentActions.loadMemoAudioListened(  this.dispacher("DataListened", this.MyDataListened)  );
			break;
			case "DICTATION":
				console.log("dispacher info in DICTATION");
				studentActions.loadMemoInputTextFalse(  this.dispacher("dataDictationFalse", this.MyDataDictationFalse)  );	
				studentActions.loadMemoInputText(  this.dispacher("dataDictation", this.MyDataDictation)  );
			break;
			case "GRAMMAR":
				console.log("dispacher info in GRAMMAR");
				studentActions.loadMemoAudioListened(  this.dispacher("DataListened", this.MyDataListened)  );
			break;
			case "SPEAKING":
			case "STUDY":
			case "NEWWORDS":
				console.log("dispacher info in STUDY");
				console.log("dispacher info in NEWWORDS");
				studentActions.loadMemoAudioListened(  this.dispacher("DataListened", this.MyDataListened)  );
				studentActions.loadMemoAudioRecorded(  this.dispacher("DataRecorded", this.MyDataRecorded)  );				 
			break;
			default:
			break;
		}
	},
	responseGetScormStudentData: function(text_array){
		if(text_array[2]){
			unit_array = text_array[2].split(";");
			if (unit_array[0]){
				suspend_data =SCO_env.getSuspendData();
			   //suspend_data = '@1;29;100;25;20;43;11;10;4;@2;56;30;22;70;33;64;34;12;@';
				suspend_data_array =[];
				suspend_data_array = suspend_data.split("@");
				var aux1 =[];
				var aux2 = 0;
				var followupObj = '';
				for (i=0;i<suspend_data_array.length;i++){
					aux1 = suspend_data_array[i].split(";");
					if (aux1[0]){	
						if (aux1[0] != unit_array[0]) followupObj = followupObj + '@' + suspend_data_array[i];
						else{ 
							followupObj = followupObj + '@'+ text_array[2];
							aux2 = 1; 
						}
					}
				}
				if (aux2==0) followupObj = followupObj + '@' + text_array[2];
				SCO_env.suspendData(followupObj);
				
				var	aux3 = text_array[2].split(";");
				var por_raw=parseInt((aux3[2]+aux3[3]+aux3[4]+aux3[5]+aux3[6]+aux3[7]+aux3[8]+aux3[9])/8,10);
				SCO_env.setProgress(por_raw);
			}
		}
	},
	
	//<html><body>@4@66;0;125;0;0;0;0;0@</body></html>
	storeRequestData: function (text) {
		console.log("exe storeRequestData");
		console.log("log of STORE REQUEST DATA:"+text);
		text_array=[];
		text_array = text.split("@");
		if(text_array[1]){
			return_array = text_array[1].split(";");
			switch (return_array[0]){
				case  '101': //wgetTimerFollowup: tiempo unidad 
					{
						theTimeFollowUp=return_array[1];
						this.initCourseTimer(theTimeFollowUp);
					}
					break;
				case '1': //evolucion
					this.loadScormStudendData();
					break;
				case '2': // wgetScormAllOnload: *** memoria de la pagina
					this.responseGetScormAllOnload(text_array);
					this.responseSetUnitSectionEv(text_array);
					break;
				case '3': //wgetScormStudentData
					this.responseGetScormStudentData(text_array);
					break;
				case '4': //result wsetUnitSectionEv // recupera porcentajes totales
					this.responseSetUnitSectionEv(text_array); 
					break;
				case '5': //wsetSituationEv
					porcentajes=text_array[2].split(';');	
					MyDataAll[9]=porcentajes[0]; //update Situation
					ABA_Dispacher("DataAll", MyDataAll);  //progress
					break;
				case '200':
					this.responseGetScormAllOnload(text_array);
					break;
				default: //FollowUp *** memoria de la pagina
					ABA_Dispacher("callFollowup", text);
					break;
			}
		}	
	}
};
