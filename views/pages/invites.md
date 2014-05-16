---
title: Accept invite
layout: default
---

{{{div.invite.clear}}}
{{module:download}}
{{{/div}}}


<a class="all" href="/download">Show all downloads &raquo;</a>

******

# Install Turtl to accept your invite

<strong>Leave this page open when starting Turtl so it can find your invite.</strong>

When you install Turtl, it will automatically detect this page and add the
invite. Once you join or log in, you'll be able to accept the invite. To learn
more about Turtl, [check out the about page](/about).

<script>
    invite_scrape();

    window.addEvent('domready', function() {
        var all	=	document.getElement('body.invite a.all');
        if(all)
        {
            all.addEvent('click', function(e) {
                if(e) e.stop();
                var ul	=	document.getElement('body.invite .download ul.buttons');
                if(!ul) return false;
                ul.getElements('li').each(function(el) {
                    if(el.hasClass('div')) return;
                    el.setStyle('display', '');
                    all.dispose();
                });
            });
        }
    });
</script>

