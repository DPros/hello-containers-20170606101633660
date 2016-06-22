var draggingMatch;

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

function digit(d){
    var res = [];
    d=""+d;
    var counter=0;
    while(counter<d.length){
        var digit = $('.digit.etalon').clone();
        digit.removeClass('etalon');
        var keys = Object.keys(displayMapping[d.charAt(counter)]);
        $.each(keys, function(index, column){
            $.each(displayMapping[d.charAt(counter)][column], function(i, match){ digit.find('.'+column).find('.'+match).toggleClass('match invisible');
            });
        });
        digit.attr('matches', byteMapping[d]);
        res.push(digit);
        ++counter;
    }
    return res;
};

function sign(sign){
    var res = $('.sign.etalon').clone();
    res.removeClass('etalon');
    if(sign)res.find('.vertical').addClass('match');
    else res.find('.vertical').addClass('invisible');
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
    var equation = generate();
    var body = $('body');
    body.mouseup(function(){
        console.log("mouse up");
        if(draggingMatch){
            draggingMatch.removeClass('invisible');
        }
        $('.droparea').removeClass('droparea');
    });
    body.append(digit(equation[0])).append(sign(equation[1])).append(digit(equation[2])).append(equalsSign()).append(digit(equation[3]));
    $('.match').draggable({
        revert: "invalid"
    });
    $('.invisible').droppable({
        accept: ".match"        
    });
//    for(var i=0;i<10;i++)body.append(digit(i));
//    $('.left > div, .center > div, .right > div').on('mousedown', function(){
//        draggingMatch = $(this);
//        draggingMatch.addClass("invisible");
//        $('.invisible').addClass('droparea');
//        $('.droparea').mouseup(function(e){
//            e.preventDefault();
//            $(this).removeClass('invisible');
//            $(this).closest('.digit').attr('matches', draggingMatch.closest('.digit').attr('matches') &(1<<draggingMatch.attr('position')));
//            draggingMatch.closest('.digit').attr('matches', draggingMatch.closest('.digit').attr('matches') &~(1<<draggingMatch.attr('position')));
//            draggingMatch = null;
//            $('droparea').removeClass('droparea');
//        });
//    });
});