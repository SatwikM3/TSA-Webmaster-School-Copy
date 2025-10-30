/* Lightweight event modal + Add-to-calendar + RSVP (mailto) */
(function(){
  'use strict';

  function qs(sel, ctx){ return (ctx||document).querySelector(sel); }
  function qsa(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }

  // Create modal element and attach to body
  var modalHtml = `
  <div id="eventModalBackdrop" class="event-modal-backdrop" aria-hidden="true">
    <div class="event-modal" role="dialog" aria-modal="true" aria-labelledby="eventModalTitle">
      <header>
        <div>
          <h3 id="eventModalTitle"></h3>
          <div class="meta" id="eventModalMeta"></div>
        </div>
        <div>
          <button class="close-btn" id="eventModalClose" aria-label="Close">✕</button>
        </div>
      </header>
      <div class="description" id="eventModalDescription"></div>
      <div class="small" id="eventModalContact"></div>
      <div style="height:10px"></div>
      <div class="actions">
        <button id="addToCalendarBtn" class="btn-ghost">Add to Google Calendar</button>
        <button id="rsvpBtn" class="btn-primary">RSVP (Gmail)</button>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  var backdrop = qs('#eventModalBackdrop');
  var modalTitle = qs('#eventModalTitle');
  var modalMeta = qs('#eventModalMeta');
  var modalDescription = qs('#eventModalDescription');
  var modalContact = qs('#eventModalContact');
  var closeBtn = qs('#eventModalClose');
  var addToCalendarBtn = qs('#addToCalendarBtn');
  var rsvpBtn = qs('#rsvpBtn');

  function openModal(data){
    modalTitle.textContent = data.title || 'Event';
    // structured meta: When / Where / Notes
    modalMeta.innerHTML = '';
    var when = (data.date || '') + (data.time ? ' — '+data.time : '');
    var where = data.location || '';
    var notes = data.duration || '';
    modalMeta.innerHTML = '<div class="grid">'
      + '<div><div class="label">When</div><div class="value">'+escapeHtml(when)+'</div></div>'
      + '<div><div class="label">Where</div><div class="value">'+escapeHtml(where)+'</div></div>'
      + (notes ? '<div><div class="label">Notes</div><div class="value">'+escapeHtml(notes)+'</div></div>' : '')
      + '</div>';
    modalDescription.innerHTML = data.description || '';
    modalContact.innerHTML = data.contact ? ('<div class="label">Contact</div><div class="value"><a href="mailto:'+escapeHtml(data.contact)+'">'+escapeHtml(data.contact)+'</a></div>') : '';

    // Add to Google Calendar link
    var gcalUrl = buildGoogleCalendarUrl({
      title: data.title,
      details: stripTags(data.description || ''),
      location: data.location || '',
      start: data.start,
      end: data.end
    });
    addToCalendarBtn.onclick = function(){ window.open(gcalUrl, '_blank'); };

    // RSVP: open Gmail compose in a new tab with prefilled fields; fallback to mailto
    rsvpBtn.onclick = function(){
      var subject = 'RSVP: '+(data.title||'');
      var body = 'Hi,\n\nI would like to RSVP for "'+(data.title||'')+'" on '+(data.date||'')+' at '+(data.time||'')+'\n\nThanks!';
      var to = data.contact || '';
      // Gmail compose URL
      var gUrl = 'https://mail.google.com/mail/?view=cm&fs=1';
      if(to) gUrl += '&to='+encodeURIComponent(to);
      gUrl += '&su='+encodeURIComponent(subject);
      gUrl += '&body='+encodeURIComponent(body);
      // open in new tab
      window.open(gUrl, '_blank');
    };

    // show
    backdrop.setAttribute('aria-hidden', 'false');
    // focus close button
    closeBtn.focus();
    // trap focus simple
    trapFocus(backdrop);
  }

  function closeModal(){
    backdrop.setAttribute('aria-hidden', 'true');
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function(e){ if(e.target===backdrop) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ if(backdrop.getAttribute('aria-hidden')==='false') closeModal(); } });

  // Attach to each card (.timeline-content) so clicking the card opens the modal
  function init(){
    var cards = qsa('.timeline-content');
    cards.forEach(function(card){
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(){
        var el = card;
        var data = {
          title: el.getAttribute('data-title') || el.querySelector('h2')?.textContent,
          date: el.getAttribute('data-date') || (el.querySelector('.timeline-date')? el.querySelector('.timeline-date').textContent : ''),
          time: el.getAttribute('data-time'),
          duration: el.getAttribute('data-duration'),
          location: el.getAttribute('data-location') || (el.querySelector('.timeline-location')? el.querySelector('.timeline-location').textContent : ''),
          description: el.getAttribute('data-description'),
          contact: el.getAttribute('data-contact'),
          start: el.getAttribute('data-start'),
          end: el.getAttribute('data-end')
        };
        openModal(data);
      });
    });
  }

  // helpers
  function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function stripTags(s){ return (s||'').replace(/<[^>]*>/g,''); }

  function pad(n){ return n<10 ? '0'+n : ''+n; }
  function toICalDate(d){ // expects Date
    return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+'Z';
  }

  function buildIcs(ev){
    try{
      var sd = ev.start ? new Date(ev.start) : new Date();
      var ed = ev.end ? new Date(ev.end) : new Date(sd.getTime()+60*60*1000);
      var lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//community//TSA-Webmaster//EN',
        'BEGIN:VEVENT',
        'UID:'+(''+Date.now())+'@community.local',
        'DTSTAMP:'+toICalDate(new Date()),
        'DTSTART:'+toICalDate(sd),
        'DTEND:'+toICalDate(ed),
        'SUMMARY:'+ev.title,
        'DESCRIPTION:'+ev.description,
        'LOCATION:'+ev.location,
        'END:VEVENT',
        'END:VCALENDAR'
      ];
      return lines.join('\r\n');
    }catch(err){ return ''; }
  }

  function buildGoogleCalendarUrl(ev){
    // https://www.google.com/calendar/render?action=TEMPLATE&text=...&dates=YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ&details=...&location=...
    var sd = ev.start ? new Date(ev.start) : new Date();
    var ed = ev.end ? new Date(ev.end) : new Date(sd.getTime()+60*60*1000);
    var dates = toICalDate(sd)+'/'+toICalDate(ed);
    var url = 'https://www.google.com/calendar/render?action=TEMPLATE';
    url += '&text='+encodeURIComponent(ev.title||'Event');
    url += '&dates='+encodeURIComponent(dates);
    url += '&details='+encodeURIComponent(ev.details||'');
    url += '&location='+encodeURIComponent(ev.location||'');
    return url;
  }

  // very small focus trap: keep focus inside modal while open
  function trapFocus(container){
    var focusable = container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    focusable = Array.from(focusable).filter(function(i){ return !i.hasAttribute('disabled'); });
    if(!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length-1];
    function keyHandler(e){
      if(e.key !== 'Tab') return;
      if(e.shiftKey){ if(document.activeElement===first){ e.preventDefault(); last.focus(); } }
      else { if(document.activeElement===last){ e.preventDefault(); first.focus(); } }
    }
    container.addEventListener('keydown', keyHandler);
    // remove when closed
    var obs = new MutationObserver(function(){ if(container.getAttribute('aria-hidden')==='true'){ container.removeEventListener('keydown', keyHandler); obs.disconnect(); } });
    obs.observe(container, { attributes:true, attributeFilter:['aria-hidden'] });
  }

  // init on DOM ready
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
