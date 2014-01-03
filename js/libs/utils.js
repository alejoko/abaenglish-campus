var ABA_utils = {
	
	config : {
		selectedClass : "selected"
	},

	/**
	 * Object Initialization
	 * @param config
	 */
	init : function( config ) {
	    //Adds data from the call to the options object
		this.config = $.extend(this.config, config);
	},	
	
	cancelBubble: function(event){
		if (!event) var event = window.event;
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();
	},
	
	/**
	 * Remove "selected" class in selector elements
	 * @param elements
	 */
	cleanSelectedClass : function (elements){
		elements.each(function(el){
			if($(this).hasClass(common.config.selectedClass)){
				$(this).removeClass(common.config.selectedClass);
			}
		});
	},
	
	/**
	 * Add "selected" class in selector elements
	 * @param elements
	 */
	addSelectedClass : function (elements){
		elements.each(function(el){
			if(!$(this).hasClass(common.config.selectedClass)){
				$(this).addClass(common.config.selectedClass);
			}
		});
	},
	
	timestampToString: function(inTime)
	{
		var theTime;//final format ="00:00:00";
		var min;
		var hours;
		hours = Math.floor(inTime/60);
		min = Math.floor((inTime-(hours*60)));
		if(hours<10)
			hours ="0"+hours;
		if(min<10)	
			min ="0"+min;
		theTime=hours+":"+min+":00";	
		return theTime;
	},
	trimStr:function(str){
		for(i=str.length-1; i>=0; i=str.length-1){
			if(str.charAt(i)==" ")
				str=str.substring(0,i);
			else
				break;
		}
		return str;
	},
	stripPunctuation:function(text){
		var text2=null;
		//normalisacion de los espacios
		text2=text.replace(/\s+/g, ' ');
		//quitamos la puntuacion que no es importante para el ejercicio
		text2=text2.replace(/[,;:?!.]/g, '');
		return text2;
	},
	doCompareString:function (aux1,aux2){
		var b = true;
		var i = 0;
		aux1 = aux1.toLowerCase();
		aux2 = aux2.toLowerCase();
		var aux1s = ABA_utils.stripPunctuation(aux1);
		var aux2s = ABA_utils.stripPunctuation(aux2);
		
		if (ABA_utils.trim(aux1s)==ABA_utils.trim(aux2s)) b=true; 
		else b= false;

		if (b) return false;
		else{
			b = true;
			i = 0;
			while (i<aux2s.length && b){
				b = (aux1s.substring(i,i+1)==aux2s.substring(i,i+1));
				if(b==true) i++;
			}
			j=0;k=0;
			while (j<=i){
				if(aux1s.substring(j,j+1)==aux1.substring(k,k+1)){
					j++;
				}
				k++;
			}
			return k; //posición en la que difieren
		}
	},
	doValidate: function (entry, solution){
		var i = ABA_utils.doCompareString(entry,solution);
		if (i==false) return true;
		return false;
	},
	
	pad: function(number, length, char) {
		   
	    var str = '' + number;
	    while (str.length < length) {
	        str = char + str;
	    }
	   
	    return str;

	},
	
	trim: function(str) {
		return  str.replace(/^\s+/g,'').replace(/\s+$/g,'');
	},

	ltrim: function(str) {
		return str.replace(/^s+/,"");
	},

	rtrim: function(str) {
		return str.replace(/s+$/,"");
	},
	trimNumber: function(str) {
		  while (str.substr(0,1) == '0' && str.length>1) { str = str.substr(1,9999); }
		  return str;
	},	
	setAttrBoxOpener: function($target,href){
		$target.attr("href",href);
	},

	
};

////////////////////////////////////////////////////////////
function ABA_timer(inDelay, inInterval, inFunction, inOwner){
	this.delay=inDelay;
	this.interval=inInterval;
	this.FN=inFunction;
	this.timerID=0;
	this.owner=inOwner;
	this.delayFn=null;
	this.start=function(){
		var me = this;		
		this.delayFn = function() { me._callback(me);};
		this.timerID=setTimeout(this.delayFn, this.delay);    
	};
	this._callback=function(inObj){	
		inObj.stop();
		inObj.FN(inObj.owner);
		inObj.timerID=setTimeout(inObj.delayFn, inObj.interval);    
	};
	this.stop=function(){
		if(this.timerID!=0){
			clearTimeout(this.timerID);
			this.timerID=0;
		}	
	};
};
/////////////////////////////////////////////////////////////

ABA_utils.init(); 
