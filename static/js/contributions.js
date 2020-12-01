const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const now = new Date();
let contributions;

(() => {
  const dom = document.querySelector('#contributions');
  if (!dom) {
    return;
  }

  contributions = JSON.parse(dom.getAttribute('data'));
  let year = 0;
  for (const item of contributions) {
    item.publishDate = decodeURI(item.publishDate);
    item.date = new Date(item.publishDate);
    if (item.date.getFullYear() > year) {
      year = item.date.getFullYear();
    }
    item.title = decodeURI(item.title);
  }

  yearList();
  yearly(year);
})();

function yearly(year) {
  let startDate;
  let endDate;
  if (year != now.getFullYear()) {
    const date = new Date(year, 0);
    startDate = new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000);
    endDate = new Date(date.getFullYear(), 11, 31);
  } else {
    endDate = now;
    startDate = new Date(endDate.getTime() - 364 * 24 * 60 * 60 * 1000 - endDate.getDay() * 24 * 60 * 60 * 1000);
  }
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  const posts = [];
  const ms = [];
  for (const item of contributions) {
    if (item.date >= startDate && item.date <= endDate) {
      posts.push(item);
      const y = year - item.date.getFullYear();
      const relativeMonth = item.date.getMonth() - 12 * y;
      if (!ms.includes(relativeMonth)) {
        ms.push(relativeMonth);
      }
    }
  }
  posts.sort((a, b) => { return b - a });
  document.querySelector('#posts-activity').innerHTML = '';
  var count = 0;
  for (const relativeMonth of ms) {
    const node = document.createElement('div');

    const itemYear = relativeMonth >= 0 ? year : year + Math.floor(relativeMonth / 12);
    const itemMonth = relativeMonth >= 0 ? relativeMonth : 12 + relativeMonth % 12;

    if (count < 2) {
      node.className = `term-${itemYear}-${itemMonth+1}`;
    }
    else {
      node.className = `term-${itemYear}-${itemMonth+1} hidden`;
    }
    node.innerHTML = monthly(itemYear, itemMonth, posts);
    document.querySelector('#posts-activity').appendChild(node);
    count++;
  }

  graph(year, posts, startDate, endDate);

  const yearList = document.querySelectorAll('.js-year-link');
  for (const elem of yearList) {
    if (elem.innerText == year.toString()) {
      elem.classList.add('selected');
    } else {
      elem.classList.remove('selected');
    }
  }
}

function monthly(year, month, posts) {
  const monthPosts = posts.filter(post =>
    post.date.getFullYear() === year && post.date.getMonth() === month
  );
  let liHtml = '';
  for (const post of monthPosts) {
    liHtml += `<li class="d-flex mt-1 py-1 flex-row flex-nowrap flex-justify-between"><span class="flex-auto css-truncate css-truncate-target">
  <span class="profile-rollup-icon">
    <svg class="octicon octicon-repo mr-2 text-gray flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg>
  </span>
  <a class="mr-2 " data-hovercard-type="repository" href="${post.link}">${post.title}</a>
</span>
<time title="This post was made on ${months[post.date.getMonth()]} ${post.date.getDate()}" class="f6 text-gray-light pt-1">
  ${months[post.date.getMonth()]} ${post.date.getDate()}
</time></li>`;
  }
  let html = `
  <div class="contribution-activity-listing float-left col-12 col-lg-10">
    <div class="profile-timeline discussion-timeline width-full pb-4">
      <h3 class="profile-timeline-month-heading bg-white d-inline-block h6 pr-2 py-1">
        ${months[month]} <span class="text-gray">${monthPosts.length > 0 ? monthPosts[0].date.getFullYear() : year}</span>
      </h3>
      <div class="profile-rollup-wrapper py-4 pl-4 position-relative ml-3 js-details-container Details open">
        <span class="discussion-item-icon"><svg class="octicon octicon-repo-push" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1 2.5A2.5 2.5 0 013.5 0h8.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V1.5h-8a1 1 0 00-1 1v6.708A2.492 2.492 0 013.5 9h3.25a.75.75 0 010 1.5H3.5a1 1 0 100 2h5.75a.75.75 0 010 1.5H3.5A2.5 2.5 0 011 11.5v-9zm13.23 7.79a.75.75 0 001.06-1.06l-2.505-2.505a.75.75 0 00-1.06 0L9.22 9.229a.75.75 0 001.06 1.061l1.225-1.224v6.184a.75.75 0 001.5 0V9.066l1.224 1.224z"></path></svg></span>
        <button type="button" class="btn-link f4 muted-link no-underline lh-condensed width-full js-details-target "
          aria-expanded="false">
          <span class="float-left ws-normal text-left">
            Created ${monthPosts.length} post${monthPosts.length > 1 ? 's' : ''}
          </span>
          <span class="d-inline-block float-right">
            <span class="profile-rollup-toggle-closed float-right" aria_label="Collapse">
              <svg class="octicon octicon-fold" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.896 2H8.75V.75a.75.75 0 00-1.5 0V2H5.104a.25.25 0 00-.177.427l2.896 2.896a.25.25 0 00.354 0l2.896-2.896A.25.25 0 0010.896 2zM8.75 15.25a.75.75 0 01-1.5 0V14H5.104a.25.25 0 01-.177-.427l2.896-2.896a.25.25 0 01.354 0l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25zm-6.5-6.5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path></svg>
            </span>
            <span class="profile-rollup-toggle-open float-right" aria_label="Expand">
              <svg class="octicon octicon-unfold" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.177.677l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25a.75.75 0 01-1.5 0V4H5.104a.25.25 0 01-.177-.427L7.823.677a.25.25 0 01.354 0zM7.25 10.75a.75.75 0 011.5 0V12h2.146a.25.25 0 01.177.427l-2.896 2.896a.25.25 0 01-.354 0l-2.896-2.896A.25.25 0 015.104 12H7.25v-1.25zm-5-2a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path></svg>
            </span>
          </span>
        </button>
        <ul class="profile-rollup-content mt-1" data-repository-hovercards-enabled="" id="posts-activity-ul">
        ${liHtml}
        </ul>
      </div>
    </div>
  </div>
  `;
  return html;
}

function yearList() {
  const years = [];
  for (const item of contributions) {
    const year = item.date.getFullYear();
    if (!years.includes(year)) {
      years.push(year);
    }
  }
  years.sort((a, b) => { return b - a });

  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const node = document.createElement('li');
    node.innerHTML = `<a class="js-year-link filter-item px-3 mb-2 py-2" aria-label="Post activity in ${year}" onclick="selectYear(${year})">${year}</a>`;
    document.querySelector('#year-list').appendChild(node);
  }
}

function graph(year, posts, startDate, endDate) {
  const postsStr = posts.length === 1 ? "post" : "posts";
  if (year === now.getFullYear()) {
    document.querySelector('#posts-count').innerText = `${posts.length}  ${postsStr} in the last year`;
  } else {
    document.querySelector('#posts-count').innerText = `${posts.length}  ${postsStr} in ${year}`;
  }

  let html = ``;
  const count = {};
  for (const post of posts) {
    const date = `${post.date.getFullYear()}-${(post.date.getMonth() + 1).toString().padStart(2, '0')}-${post.date.getDate().toString().padStart(2, '0')}`;
    if (count[date] == undefined) {
      count[date] = 1;
    } else {
      count[date]++;
    }
  }
  const monthPos = [];
  let startMonth = -1;
  for (let i = 0; i < 53; i++) {
    html += `<g transform="translate(${i * 16}, 0)">`;
    for (let j = 0; j < 7; j++) {
      const date = new Date(startDate.getTime() + (i * 7 + j) * 24 * 60 * 60 * 1000);
      const dataDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      if (date > endDate) {
        continue;
      }

      if (j == 0) {
        if (i <= 51) {
          if (startMonth != date.getMonth()) {
            monthPos.push(i);
            startMonth = date.getMonth();
          }
        }
      }

      let c;
      if (count[dataDate] == undefined) {
        c = 0;
      } else {
        c = count[dataDate];
      }
      let color;
      switch (c) {
        case 0:
          color = "#ebedf0";
          break;
        case 1:
          color = "#9be9a8";
          break;
        case 2:
          color = "#40c463";
          break;
        case 3:
          color = "#30a14e";
          break;
        default:
          color = "#216e39";
      }
      html += `<rect class="day" width="11" height="11" x="${16 - i}" y="${j * 15}"
      fill="${color}" data-count="${c}"
      data-date="${dataDate}" onClick="onClickRect(this, ${date.getFullYear()},${date.getMonth()},${date.getDate()},${c > 0})"></rect>`;
    }
    html += '</g>';
  }
  if (monthPos[1] - monthPos[0] < 2) {
    monthPos[0] = -1;
  }
  for (let i = 0; i < monthPos.length; i++) {
    const month = monthPos[i];
    if (month == -1) {
      continue;
    }
    html += `<text x="${15 * month + 16}" y="-9"
    class="month">${months[(i + startDate.getMonth()) % 12]}</text>`;
  }
  html += `
<text text-anchor="start" class="wday" dx="-10" dy="8"
style="display: none;">Sun</text>
<text text-anchor="start" class="wday" dx="-10" dy="25">Mon</text>
<text text-anchor="start" class="wday" dx="-10" dy="32"
style="display: none;">Tue</text>
<text text-anchor="start" class="wday" dx="-10" dy="56">Wed</text>
<text text-anchor="start" class="wday" dx="-10" dy="57"
style="display: none;">Thu</text>
<text text-anchor="start" class="wday" dx="-10" dy="85">Fri</text>
<text text-anchor="start" class="wday" dx="-10" dy="81"
style="display: none;">Sat</text>
`;
  document.querySelector('#graph-svg').innerHTML = html;
//  stopClickEvent('.day');
}

function resetSelectedStates(activities, parent, rects) {
    // reset selected states
    var activityCount = 0;
    for (const item of activities) {
      if (activityCount < 2) {
        item.classList.remove('hidden');
      }
      else if (!item.classList.contains('hidden')) {
        item.classList.add('hidden');
      }
      activityCount++;
    }

    parent.classList.remove('days-selected');
    for (const r of rects) {
      r.classList.remove('active');
    }

    // show a button
    const showMoreActivityButton = document.querySelector('.contribution-activity-show-more')
    showMoreActivityButton.classList.remove('hidden');
}

function onClickRect(self, year, month, day, hasPosts) {
  if (!hasPosts) {
    event.stopPropagation();
    return;
  }

  const activities = document.querySelector('#posts-activity').childNodes;
  const parent = document.querySelector('.calendar-graph');
  const rects = document.querySelectorAll('.day');

  if (self.classList.contains('active')) {
    // reset selected states
    resetSelectedStates(activities, parent, rects);
  }
  else {
    // select a rect
    const targetClass = `term-${year}-${month+1}`;
    for (const item of activities) {
      if (item.classList.contains(targetClass)) {
        item.classList.remove('hidden');
      }
      else if (!item.classList.contains('hidden')) {
        item.classList.add('hidden');
      }
    }

    if (!parent.classList.contains('days-selected')) {
      parent.classList.add('days-selected');
    }
    for (const r of rects) {
      if (r !== self) {
        r.classList.remove('active');
      }
      else {
        r.classList.add('active');
      }
    }

    // hide a button
    const showMoreActivityButton = document.querySelector('.contribution-activity-show-more')
    if (!showMoreActivityButton.classList.contains('hidden')) {
      showMoreActivityButton.classList.add('hidden');
    }
  }

  event.stopPropagation();
}


function showMoreActivity(self) {
  const activities = document.querySelector('#posts-activity').childNodes;
  for (const item of activities) {
    item.classList.remove('hidden');
  }
  self.classList.add('hidden');
  event.stopPropagation();
}


function selectYear(year) {
  // switch year
  yearly(year);

  const activities = document.querySelector('#posts-activity').childNodes;
  const parent = document.querySelector('.calendar-graph');
  const rects = document.querySelectorAll('.day');

  resetSelectedStates(activities, parent, rects);

  //
  event.stopPropagation();
}
