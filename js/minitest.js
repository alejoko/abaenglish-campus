var minitestActions = {
	config : {
		minRequiredNumAnswers: 10,
		minDone: 8
	},
	initUnit: function(){
			ABA_env.setSection("MINITEST");
			ABA_env.setPreviousPage("");
			ABA_env.setNextPage("");
			ABA_env.setInxPageSection(1);
			ABA_env.setTotalPagesSection(1);
			ABA_env.setPage("");
			// first request to server
			PROXY_env.HTMLNewPageInicial();
			// initialize JavaScript
			studentActions.init({
				steepText: "PASO"
			});	 
	},
	valida: function($gadget){
		var arrValues=[];
		var arrAnswerQuestions=[];
		var totalAnswers = 0;
		var nota = 0;
		$collectionAnswers = $gadget.find("input[type='checkbox']:checked");
		$collectionAnswers.each(function(index){
			console.log($(this).attr("value"));
			arrValues.push($(this).attr("value"));
			totalAnswers++;
			arrAnswerQuestions.push($(this).closest(".column_right").find(".questions").attr("value"));
			console.log(arrAnswerQuestions);
			nota += (arrValues[index]==arrAnswerQuestions[index])?1:0;
		});
		console.log(arrValues);

		if(totalAnswers >= minitestActions.config.minRequiredNumAnswers){
					
				if(nota<minitestActions.config.minDone){
					alert("Su nota es "+nota+"/10 : Deber�a volver a hacer el test");
				}else{
					alert("Su nota es "+nota+"/10 : ha validado el test");
				}
				
		} else {
				alert("Debe responder todo el test para que sea corregido");
		}
	}

};