    $(document).ready(function(){
        console.log("shit is logging okay, now doing ajax biz");

        var currentPage = {CurrentPage};
        var totalPages = {TotalPages};
        console.log ("Tumblr says the current page is {CurrentPage}")
        console.log ("Current Page is " + currentPage);
        var currentPageId = "#comic" + currentPage;

        var nextPage = currentPage - 1;
        var thisPage = "/page/" + currentPage;
        var bufNext1 = "/page/" + nextPage;
        var bufNext2 = "/page/" + (nextPage - 1);
        var bufNext3 = "/page/" + (nextPage - 2);

        var prevPage = currentPage + 1;
        var bufPrev1 = "/page/" + prevPage;
        var bufPrev2 = "/page/" + (prevPage + 1);
        var bufPrev3 = "/page/" + (prevPage + 2);

        var pageNextBuffer =  currentPage - 1;
        var pagePrevBuffer = totalPages - currentPage;

        var movePrev = false;
        var moveNext = false;   

        var currentFrame = 2;
        var nextFrame = 3;
        var prevFrame = 1;
        var loadTime = false;

        $.get(bufPrev1, function(data){
            var $PageObject= data;
            var $PageElement = $($PageObject).find('#ajaxdetect');
            $('li.frame1').append($PageElement);
        });  

        $.get(bufNext1, function(data){
            var $PageObject= data;
            var $PageElement = $($PageObject).find('#ajaxdetect');
            $('li.frame3').append($PageElement);
        });

        console.log ("The page next buffer is " + pageNextBuffer);
        console.log ("The page prev buffer is " + pagePrevBuffer);

        $('.flexslider').flexslider({
            animation: "slide",
            startAt: 1,
            animationLoop: true, 
            slideshow: false,
             
            start: function(slider){},

            before: function(slider){

                var paginateNext = function () {
                    currentPage = currentPage - 1;
                    currentPageId = "#comic" + currentPage;

                    nextPage = currentPage - 1;
                    thisPage = "/page/" + currentPage;
                    bufNext1 = "/page/" + nextPage;
                    bufNext2 = "/page/" + (nextPage - 1);
                    bufNext3 = "/page/" + (nextPage - 2);

                    prevPage = currentPage + 1;
                    bufPrev1 = "/page/" + prevPage;
                    bufPrev2 = "/page/" + (prevPage + 1);
                    bufPrev3 = "/page/" + (prevPage + 2);

                    pageNextBuffer =  currentPage - 1;
                    pagePrevBuffer = totalPages - currentPage;

                    //console.log('This page: '+thisPage, "bufNext1: "+bufNext1, "bufNext2: "+bufNext2, "bufNext3: "+bufNext3);

                    if (currentFrame < 3) {
                        currentFrame += 1;
                    } else if (currentFrame == 3){
                        currentFrame = 1;
                    } else {
                        console.error('CURRENT FRAME WENT APESHIT ', currentFrame);
                    }
                    if (nextFrame < 3) {
                        nextFrame += 1;
                    } else if (nextFrame == 3){
                        nextFrame = 1;
                    } else {
                        console.error('NEXT FRAME WENT APESHIT ', currentFrame);
                    }
                    if (prevFrame < 3) {
                        prevFrame += 1;
                    } else if (prevFrame == 3){
                        prevFrame = 1;
                    } else {
                        console.error('PREV FRAME WENT APESHIT ', currentFrame);
                    }
                }

                var paginatePrev = function () {
                    currentPage = currentPage + 1;
                    var currentPageId = "#comic" + currentPage;

                    nextPage = currentPage + 1;
                    thisPage = "/page/" + currentPage;
                    bufNext1 = "/page/" + nextPage;
                    bufNext2 = "/page/" + (nextPage - 1);
                    bufNext3 = "/page/" + (nextPage - 2);

                    prevPage = currentPage + 1;
                    bufPrev1 = "/page/" + prevPage;
                    bufPrev2 = "/page/" + (prevPage + 1);
                    bufPrev3 = "/page/" + (prevPage + 2);

                    pageNextBuffer =  currentPage - 1;
                    pagePrevBuffer = totalPages - currentPage;
                    console.log("paginatePrev completed");  
                }

                console.log(slider.animatingTo, slider.currentSlide, " bullshit"); 

                if (slider.animatingTo > slider.currentSlide || (slider.animatingTo == 0 && slider.currentSlide == 2)){
                    console.log("Movin' Forward");
                    if (pageNextBuffer > 0) {
                        console.log("Page "+bufPrev3+" is next for the end");                
                        paginateNext();
                        moveNext = true;
                    }
                }else if (slider.animatingTo < slider.currentSlide || (slider.animatingTo == 2 && slider.currentSlide == 0)){

                    if (pagePrevBuffer > 0) {
                        paginatePrev();
                        console.log("Page "+bufPrev3+" is next for the end");
                        movePrev = true;
                    }
                }

                if (loadTime == false){
                    if ((slider.animatingTo == 0 && slider.currentSlide == 2) || (slider.animatingTo == 2 && slider.currentSlide == 0)){
                        loadTime = true;
                        console.log("setting loadTime to true");
                    }
                }

            },

            after: function(slider){

                if (pageNextBuffer <= 0){
                    $('.flex-next').addClass('disabled');
                } else {
                    $('.flex-next').removeClass('disabled');
                }

                if (pagePrevBuffer <= 0) {
                    $('.flex-prev').addClass('disabled');
                } else {
                    $('.flex-prev').removeClass('disabled');
                }

                var getPageAjax = function (pageLink, targetFrame, pageClass) {
                    
                    $.ajax({
                        url: pageLink,
                        beforeSend:function(){
                            $(('.'+targetFrame)).empty();
                            $('.'+targetFrame).append("<img src='http://2.bp.blogspot.com/-iarq5sjWDWc/TWRxt8nPegI/AAAAAAAAA_0/ABabl2TlOO0/s320/emu.jpg' /><br /><br /><h1>LOADING</h1>");
                        },
                        success: function(data) {
                            $(('.'+targetFrame)).empty();
                            var $nextPageElement = $(data).find('#ajaxdetect > *');
                            $('.'+targetFrame).append($nextPageElement);
                            console.log ("replacement of " + targetFrame + " is succssful");   
                        }
                    });
                }

                console.log(slider.currentSlide, slider.count);

                if(moveNext == true && loadTime == true) {
                            console.log ("hit the edge at pos ", slider.currentSlide);

                            currentFrame = (slider.currentSlide +1);

                    if (pageNextBuffer > 0) {
                        if (currentFrame == 1){
                            console.log ("replacing frame 2")
                            getPageAjax(bufNext1, "frame2", (nextPage));
                        } else if (currentFrame == 2){
                            console.log ("replacing frame 3")
                            getPageAjax(bufNext1, "frame3", (nextPage));
                        } else if (currentFrame == 3){
                            console.log ("replacing frame 1")
                            getPageAjax(bufNext1, "frame1", (nextPage));
                        } else {
                            console.error ("Something has gone wrong with where the current frame is");
                        }

                        
                    } else {
                        console.log ("hit the beginning of story");
                    }

                    moveNext = false;
                } else if (movePrev == true && loadTime == true){
                    if (pagePrevBuffer > 0) {

                        if (currentFrame == 1){
                            console.log ("replacing frame 2")
                            getPageAjax(bufPrev1, "frame2", prevPage);
                        } else if (currentFrame == 2){
                            console.log ("replacing frame 3")
                            getPageAjax(bufPrev1, "frame3", prevPage);
                        } else if (currentFrame == 3){
                            console.log ("replacing frame 1")
                            getPageAjax(bufPrev1, "frame1", prevPage);
                        } else {
                            console.error ("Something has gone wrong with where the current frame is");
                        }
                    }
                    movePrev = false;
                }
                console.log ("Pages:  " + prevPage + " | " + currentPage + " | " + nextPage);
            }
        });
    });