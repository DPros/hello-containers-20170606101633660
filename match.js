var droppableOptions = {
    tolerance: "pointer",
    accept: ".match img",
    activeClass: "highlighted",
    drop: function(event, ui){
        drop(event, ui, $(this));
    }
};
var draggableOptions = {
    revert: "invalid"
}
    
var byteMapping = [119, 3, 62, 31, 75, 93, 125, 19, 127, 95];
var matchCount = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];
    
var displayMapping = [
    {
        left: ['top', 'bottom'],
        center: ['top', 'bottom'],
        right: ['top', 'bottom']
    },
    {
        right: ['top', 'bottom']
    },
    {
        left: ['bottom'],
        center: ['top', 'center', 'bottom'],
        right: ['top']
    },
    {
        center: ['top', 'center', 'bottom'],
        right: ['top', 'bottom']
    },
    {
        left: ['top'],
        center: ['center'],
        right: ['top', 'bottom']
    },
    {
        left: ['top'],
        center: ['top', 'center', 'bottom'],
        right: ['bottom']
    },
    {
        left: ['top', 'bottom'],
        center: ['top', 'center', 'bottom'],
        right: ['bottom']
    },
    {
        center: ['top'],
        right: ['top', 'bottom']
    },
    {
        left: ['top', 'bottom'],
        center: ['top', 'center', 'bottom'],
        right: ['top', 'bottom']
    },
    {
        left: ['top'],
        center: ['top', 'center', 'bottom'],
        right: ['top', 'bottom']
    }
];

function getBackground(keyword){
 $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
            tags: keyword,
            tagmode: "any",
            format: "json"
        },
        function(data) {
            var rnd = Math.floor(Math.random() * data.items.length);

            var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");

            $('body').css('background-image', "url('" + image_src + "')");

        });
}

function startDrag(source){
}

function stopDrag(match){
    $('.ui-droppable').removeClass('highlighted');
}

function drop(event, match, droparea){
    var parent = $(match.draggable.context.parentNode);
    droparea.append(parent.find('img').removeAttr('style').clone());
    parent.toggleClass('match droparea').droppable(droppableOptions).empty();
    droparea.droppable("destroy").toggleClass('match droparea').find('img').draggable(draggableOptions);
    recalculate(parent, droparea);
}

function recalculate(source, target){
    var matches = source.closest('.digit').attr('matches');
    matches &=  ~(1<<source.attr('position'));
    source.closest('.digit').attr('matches', matches);
    matches = target.closest('.digit').attr('matches');
    matches |= (1<<target.attr('position'));
    target.closest('.digit').attr('matches', matches);
    var n1=0;
    var n2=0;
    var current = 0;
    var counter = 0;
    var mistake = false;
    $('#content > div').each(function(){
        if(mistake)return;
        if($(this).hasClass('digit')){
            if($(this).attr('matches')==0)return;
            if(byteMapping.indexOf(parseInt($(this).attr('matches')))<0){
                console.log($(this).attr('matches'));
                console.log(byteMapping.indexOf($(this).attr('matches')));
                console.log('mistake');
                mistake = true;
                return;
            }
            current=current * 10 + byteMapping.indexOf(parseInt($(this).attr('matches')));
        }
        else if($(this).hasClass('sign')){
            n1 = current;
            current = 0;
        }
        else if($(this).hasClass('equals')){
            n2 = current;
            current = 0;
        }
    });
    processEmptyDigits();
    if(mistake)return;
    console.log(n1 + " " + n2 + " " + current);
    if($('#content .plus').length==1){
        if(current == n1 + n2)success();
    }else{
        if(current == n1 - n2)success();
    }
}

function processEmptyDigits(){
    $('.digit[matches="0"]').each(function(){
        if($(this).next().attr('matches')=="0")$(this).remove();
    });
    if($('.digit:first').attr('matches')!="0")$('#content').prepend($('.digit.etalon').clone().removeClass('etalon'));
    if($('.plus, .minus').next().attr('matches')!="0")$('.plus, .minus').after($('.digit.etalon').clone().removeClass('etalon'));
    if($('#content .equals').next().attr('matches')!="0")$('#content .equals').after($('.digit.etalon').clone().removeClass('etalon'));
}

function success(){
    alert("Solved");
}

function digit(d){
    var res = [digit = $('.digit.etalon').clone().removeClass('etalon')];
    d=""+d;
    var counter=0;
    while(counter<d.length){
        var digit = $('.digit.etalon').clone();
        digit.removeClass('etalon');
        var keys = Object.keys(displayMapping[d.charAt(counter)]);
        $.each(keys, function(index, column){
            $.each(displayMapping[d.charAt(counter)][column], function(i, match){ 
                digit.find('.'+column).find('.'+match).toggleClass('match droparea');
                digit.find('.'+column).find('.'+match).append("<img src='matchv.png'/>");
            });
        });
        digit.attr('matches', byteMapping[parseInt(d.charAt(counter))]);
        res.push(digit);
        ++counter;
    }
    return res;
};

function sign(sign){
    var res = $('.sign.etalon').clone();
    res.removeClass('etalon');
    if(sign){
        res.find('.vertical').append("<img src='matchv.png'/>").toggleClass('droparea match');
        res.addClass('plus');
    }else res.addClass('minus');
    return res;
}

function equalsSign(){
    var equals = $('.equals.etalon').clone();
    equals.removeClass('etalon');
    return equals;
}

function generate(numberLimit){
    var level={};
    var equation = [];
    var sign = Math.floor((Math.random() * 2));
    equation[1] = sign;
    if(sign){
        equation[0] = Math.floor((Math.random() * numberLimit)+1);
        equation[2] = Math.floor((Math.random() * numberLimit)+1);
        equation[3] = equation[0] + equation[2];
    }else{
        equation[2] = Math.floor((Math.random() * numberLimit)+1);
        equation[3] = Math.floor((Math.random() * numberLimit)+1);
        equation[0] = equation[2] + equation[3];
    }
    level.equation = equation;
    level.task = shuffle(equation);
    return level;
}

function shuffle(equation, count){
    if(count==100)return;
    var task = [];
    task[0] = task[2] = task[3] = 0;
    var matches = matchesNeeded(equation[0]);
    if(equation[1])++matches;
    matches += matchesNeeded(equation[2]);
    matches += matchesNeeded(equation[3]);
//    console.log(matches);
    while(matches>0){
                console.log(matches);
                console.log(task);
        switch(matches){
            case 1:
                task[1] = 1;
                matches=0;
                break;
            case 2: 
                var position = getPosition(task);
                task[position] = task[position] * 10 + 1;
                matches=0;
                break;
            case 3:
                var position = getPosition(task);
                task[position] = task[position] * 10 + 7;
                matches=0;
                break;
            default:
                var randomDigit = Math.floor(Math.random() * 9);
                while(matchCount[randomDigit] > matches) randomDigit = Math.floor(Math.random() * 9);
                var position = getPosition(task);
                task[position] = task[position] * 10 + randomDigit;
                matches-=matchCount[randomDigit];
        }
    }
        if(task[2]==0||task[3]==0) return shuffle(equation);
        return task;
}

function getPosition(task){
    var pos =  (!task[0]) ? 0 : ((!task[2]) ? 2 : ((!task[3]) ? 3 : randomPositionInEquation()));
//    console.log(pos);
    return pos;
}

function randomPositionInEquation(){
    var res = Math.floor(Math.random()*2 + 1);
    if(res==1)res=0;
    console.log("pos "+res);
    return res;
}

function matchesNeeded(number){
    var res=0;
    if(number>9){
        res+=matchesNeeded(Math.floor(number/10));
    }
    res += matchCount[number%10];
    return res;
}

function distance(a, b){
    var distance=0;
    for(var i=0;i<7;i++){
        if(((1<<i)&a)!=((1<<i)&b))++distance;
    }
    return distance;
}

function transition(d){
    $.each(byteMapping, function(i, v){
        console.log(i+": "+distance(byteMapping[i], byteMapping[d]));
    });
}

$( window ).load(function(){
   if(localStorage){
       if(!localStorage.getItem('background')){
           localStorage.setItem('background', 'fire')
           Math.seedran
       }
//       getBackground(localStorage.getItem('background'));
   }
    var level = generate(20);
    console.log(level);
    var content = $('#content'); 
//    var variant = new Variant(4,4);
//    console.log(variant);
    content.append(digit(level.task[0])).append(sign(level.task[1])).append(digit(level.task[2])).append(equalsSign()).append(digit(level.task[3]));
    $('.match img').draggable(draggableOptions);
    $('.droparea').droppable(droppableOptions);
//    for(var i=0;i<10;i++)body.append(digit(i));
    
    $('.background-chooser button').click(function(){
        getBackground($('.background-chooser input').val());
        if(localStorage){
            localStorage.setItem('background', $('.background-chooser input').val());
        }
    });
});