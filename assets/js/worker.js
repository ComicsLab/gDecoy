onmessage = function(e) {
    //[DataPerLine,Par_DMethod,Par_Protease,Par_SiteDecoy,Par_DecoyTag]
  console.log('Worker: Message received from main script');
  let DataPerLine=e.data[0];
  let Par_DMethod=e.data[1];
  let Par_Protease=e.data[2];
  let Par_SiteDecoy=e.data[3];
  let Par_DecoyTag=e.data[4];
  
  let Reseult_decoy=DataPerLine.map(function(num) {
       if(num.charAt(0)===">")
       {    
           var checkformat=num.split("|");
           var casenNow=0;
           if(checkformat.length >=3)
            {
                casenNow=1;
            }else  if(checkformat.length ===2) 
            {
                casenNow=3;
            }else{
                casenNow=2;
            }
            if(Par_SiteDecoy==="0" && casenNow===1)
            {
                var pepNow=num.split("");
                var locN=pepNow.indexOf("|");
                pepNow[locN]="|"+""+Par_DecoyTag+"_";
                return pepNow.join("") ;                
            }else if(Par_SiteDecoy==="0" && casenNow===2){
                return num.replace(">",">"+""+Par_DecoyTag+"_");
            }else if(Par_SiteDecoy==="1" && casenNow===2){
                var pepNow=num.split(" ");
                pepNow[0]=pepNow[0]+"_"+Par_DecoyTag;
                return pepNow.join(" ") ;
            }else if(Par_SiteDecoy==="1" && casenNow===1)
            {
                var pepNow=num.split("|");
                pepNow[1]=pepNow[1]+"_"+Par_DecoyTag;
                return pepNow.join("|") ;
            }else if(Par_SiteDecoy==="1" && casenNow===3){
                 return num+"_"+ Par_DecoyTag;
            }else{
                var pepNow=num.split("|");
                pepNow[1]= Par_DecoyTag+"_"+pepNow[1];
                return pepNow.join("|") ;
            }
           
       }else{
           
           if(Par_DMethod==="0")
           {
            return SequenceReverse(num);
           }else if(Par_DMethod==="1"){
             return  PseudoReverse(num,Par_Protease);
           }else{
               return  PseudoShuffle(num,Par_Protease);
           }
          
       }
           
        ;
    });
    console.log('Worker: Posting message back to main script');
    postMessage(Reseult_decoy);
  };

//[DataPerLine,Par_DMethod,Par_Protease,Par_SiteDecoy,Par_DecoyTag]



function SequenceReverse(XAA)
{
   dstr =XAA.split("").reverse();
   ZZ = dstr.join("");
   return ZZ;
}


function PseudoReverse(XAA,mode)
{
    dstr =XAA.split("");
    
    //datan=dstr.map( function(element, index) {
        //if(element==="K" ||element==="R" )
        //return index;});
    switch (Number(mode) ){
    case 0:
    datan=dstr.map( function(element, index) {
            if(element==="K" ||element==="R" )
            return index;});
    break;
    case 1:
    datan=dstr.map( function(element, index) {
            if((element==="K" ||element==="R") && dstr[index+1]!=="P" )
            return index;});
    break;
    case 2:
    datan=dstr.map( function(element, index) {
            if((element==="R")  )
            return index;});
    break;
    case 3:
    datan=dstr.map( function(element, index) {
            if((element==="R") && dstr[index+1]!=="P")
            return index;});
    break;
    case 4:
    datan=dstr.map( function(element, index) {
            if((element==="D" ||element==="E")  )
            return index;});
    break;
    case 5:
    datan=dstr.map( function(element, index) {
            if((element==="D" ||element==="E") && dstr[index+1]!=="P" )
            return index;});
    break;
    case 6:
    datan=dstr.map( function(element, index) {
            if((element==="K" ) )
            return index;});
    break;
        }
    
    datan=datan.filter(function (el) {
        return el !== undefined;
    });
    
    startPos=0;
    lengthKR=datan.length-1;
    var Out="";
    for(i=0;i<=lengthKR;i++)
    {
        if(i===0)
        {
            ass=dstr.slice(0,(datan[i])).reverse();
            bbd=dstr[datan[i]];
            Out=Out+ass.join('')+bbd;
        }else{
            ass=dstr.slice((datan[i-1]+1),(datan[i])).reverse();
            bbd=dstr[datan[i]];
            Out=Out+ass.join('')+bbd;
        }
    }
  
    if(dstr.length!==datan[datan.length-1])
    {  
        var tttsss=dstr.slice(datan[datan.length-1]+1,dstr.length).reverse()
        Out=Out+tttsss.join('');
    }
    
    return Out;
    

}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function PseudoShuffle(XAA,mode)
{
    dstr =XAA.split("");
    

    switch (Number(mode) ){
    case 0:
    datan=dstr.map( function(element, index) {
            if(element==="K" ||element==="R" )
            return index;});
    break;
    case 1:
    datan=dstr.map( function(element, index) {
            if((element==="K" ||element==="R") && dstr[index+1]!=="P" )
            return index;});
    break;
    case 2:
    datan=dstr.map( function(element, index) {
            if((element==="R")  )
            return index;});
    break;
    case 3:
    datan=dstr.map( function(element, index) {
            if((element==="R") && dstr[index+1]!=="P")
            return index;});
    break;
    case 4:
    datan=dstr.map( function(element, index) {
            if((element==="D" ||element==="E")  )
            return index;});
    break;
    case 5:
    datan=dstr.map( function(element, index) {
            if((element==="D" ||element==="E") && dstr[index+1]!=="P" )
            return index;});
    break;
    case 6:
    datan=dstr.map( function(element, index) {
            if((element==="K" ) )
            return index;});
    break;
        }
    
    datan=datan.filter(function (el) {
        return el !== undefined;
    });
    
    startPos=0;
    lengthKR=datan.length-1;
    var Out="";
    for(i=0;i<=lengthKR;i++)
    {
        if(i===0)
        {
            ass=shuffle(dstr.slice(0,(datan[i])));
            bbd=dstr[datan[i]];
            Out=Out+ass.join('')+bbd;
        }else{
            ass=shuffle(dstr.slice((datan[i-1]+1),(datan[i])));
            bbd=dstr[datan[i]];
            Out=Out+ass.join('')+bbd;
        }
    }
  
    if(dstr.length!==datan[datan.length-1])
    {  
        var tttsss=shuffle(dstr.slice(datan[datan.length-1]+1,dstr.length))
        Out=Out+tttsss.join('');
    }
    
    return Out;
    

}

