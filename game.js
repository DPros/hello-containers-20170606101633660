
/*

Digit object

*/


function Digit(n){
    this.digit = parseInt(n);
    this.representation = function(){
       var result;
       
       switch(n){
           case 0:
               result = [1,1,1,0,1,1,1];
               break;
           case 1:
               result = [0,1,0,0,1,0,0];
               break;
            case 2:
               result = [1,0,1,1,1,0,1];
               break;
           case 3:
               result = [1,1,0,1,1,0,1];
               break;
           case 4: 
               result = [0,1,0,1,1,1,0];
               break;
           case 5:
               result = [1,1,0,1,0,1,1];
               break;
           case 6:
               result = [1,1,1,1,0,1,1];
               break;
           case 7:
               result = [0,1,0,0,1,0,1];
               break;
           case 8:
               result = [1,1,1,1,1,1,1];
               break;
           case 9:
               result = [1,1,0,1,1,1,1];
               break;
           default:
               result = [0,0,0,0,0,0,0];
               break;      
       }
       
       return result;
   };
    this.set= function(d){
        this.digit = d;
    };
}



/*

Number object


*/



function Number(n){
    this.value = n;
    this.digits = function(){
		
		var s = ""+n;
		var res = [];
		for(var i = 0; i < s.length;i++){
			res.push(new Digit(parseInt(s[i])));
		}
		
		return res;
	};
    
}

/*

Sign object

*/



function Sign(sign,compute){
    this.sign = sign;
    this.compute = compute;
}


var plus = new Sign("+",function(a,b){return a+b;});
var minus = new Sign("-",function(a,b){return a-b;});


/*

Variant object

*/






function Variant(numbers,dim){
    this.numbers = [];
    this.signs = [];
    this.digits = [];
    this.result = 0;
    
    
    for(var i = 0; i < numbers; i++){
        this.numbers.push(new Number(Math.floor(Math.random()*Math.pow(10,dim))));
        
    }
    
    for(var i = 0; i < numbers-1; i++){
        this.signs.push(Math.floor(Math.random()*10)%2==1?plus:minus);  
    }
     
    this.result = this.numbers[0].value;
    for(var i = 1; i < numbers; i++){
        this.result = this.signs[i-1].compute(this.result,this.numbers[i].value)
    }
    
    this.numbers.push(new Number(this.result))
    
    var counter = count();
    
    for(var i = 0; i < numbers-2;i++){
        
        var v = Math.floor(Math.random()*10)%2==1?plus:minus;
        
        this.sign[i] = v;
        
        counter -= getAmount(v.sign);
    }
    
    while(counter>0){
        var d = new Digit(Math.floor(Math.random()*10));
        
        if(getAmount(d.digit)<=counter){
            this.digits.push(d);
            counter -= getAmount(d.digit);
        }
         if(counter==1){
             
             for(var i = 0; i < this.digits.length; i++){
                 if(this.digits[i].digit == 0){
                     this.digits[i].set(8);
                     counter=0;
                     break;
                 }else if(this.digits[i].digit == 3){
                     this.digits[i].set(9);
                     counter=0;
                     break;
                 }else if(this.digits[i].digit == 5){
                    this.digits[i].set(6);
                     counter=0;
                     break;
                 }else if(this.digits[i].digit == 6){
                     this.digits[i].set(8);
                     counter=0;
                     break;
                 }else if(this.digits[i].digit == 9){
                     this.digits[i].set(8);
                     counter=0;
                     break;
                 }
             }
             
         }
        else
        if(counter == 2){
            this.digits.push(new Digit(1));
            counter=0;
        }
        else
        if(counter == 3){
            this.digits.push(new Digit(7));
            counter=0;
        }
        else
        if(counter  == 4){
            this.digits.push(new Digit(4));
            counter=0;
            }
    }
    
    var str = [];
    while(this.digits.length!==0){
		
		for(var i = 0; i < numbers; i++){
			if(this.digits.length == 0) break;
			str[i]+= ""+this.digits.pop.digit;
		}
		
	}
	
	for(var i = 0; i < numbers; i++){
		this.numbers[i] = new Number(parseInt(str[i]));
	}
    
    function count(){
        var res=0;
        for(var i = 0; i < numbers; i++){
            var num  = this.numbers[i].digits;
            
			
            for(var j = 0; j < num.length; j++){
                res += getAmount(num[j]);
            }
            
        }
		
		for(var i = 0; i < numbers-2; i++){
			res += getAmount(this.signs[i].sign);
		}
        
       return res; 
    }
    
    function getAmount(f){
        var res;
        switch(f){
                
            case 2:case 3:case 5: res = 5;
                break;
            case 0:case 6: case 9:res=6;
                break;
            case 1: case '+': res = 2;
                break;
            case 4: res = 4;
                break;
            case 7: res = 3;
                break;
            case  8: res= 7;
                break;
            case '-': res=1;
                break;
        }
        return res;
    }
}


                    
/*

Game object

*/


/*

var game = [
    {levels:20,numbers:3,dim:2}
    {levels:15,numbers:3,dim:3}
    {levels:15,numbers:4,dim:4}
    {levels:10,numbers:4,dim:4}
    ];



*/
function Game(game){
    this.variants = [];
    this.totalVariants = 0;
    
    for(var i = 0; i < game.length; i++){
        
        this.variants.push([]);
        
        for(var j = 0; j < game[i].levels; j++){
            this.variants[i].push(new Variant(game[i].numbers,game[i].dim));
            this.totalVariants++;
        }
            
    }
}