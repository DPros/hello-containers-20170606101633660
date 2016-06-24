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
    parent.toggleClass('match droparea').droppable(droppableOptions).empty();
match.draggable.removeAttr('style');
 droparea.droppable("destroy").toggleClass('match droparea').append(match.draggable);
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
    $('#content > div').each(function(){
        if($(this).hasClass('digit')){
            if(!byteMapping.indexOf($(this).attr('matches')))return;
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
    if('#content .plus'){
        if(current == n1 + n2)success();
    }else{
        if(current == n1 - n2)success();
    }
}

function success(){
    alert("Solved");
}

function digit(d){
    var res = [];
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
    }
    return res;
}

function equalsSign(){
    var equals = $('.equals.etalon').clone();
    equals.removeClass('etalon');
    return equals;
}

function generate(){
    var equation = [];
    var sign = Math.floor((Math.random() * 2));
    equation[1] = sign;
    if(sign){
        equation[0] = Math.floor((Math.random() * 9)+1);
        equation[2] = Math.floor((Math.random() * 9)+1);
        equation[3] = equation[0] + equation[2];
    }else{
        equation[2] = Math.floor((Math.random() * 9)+1);
        equation[3] = Math.floor((Math.random() * 9)+1);
        equation[0] = equation[2] + equation[3];
    }
    return equation;
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
       }
       getBackground(localStorage.getItem('background'));
   }
    var equation = generate();
    console.log(equation);
    var content = $('#content'); 
    content.append(digit(equation[0])).append(sign(equation[1])).append(digit(equation[2])).append(equalsSign()).append(digit(equation[3]));
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











