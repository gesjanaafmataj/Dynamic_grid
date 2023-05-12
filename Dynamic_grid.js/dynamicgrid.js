/**
 * Based on the following example, implement the "DynamicGrid" class with the following methods and events.
 * You can either use pure JavaScript or TypeScript. 
 * Vite is allowed and optional as environment.
 *  
 *  RENDERING
 *  ---------
 *  HTML table tr td th elements are not allowed. Render with well classed div elements.
 * 
 *  BASIC Features
 *  --------------
 *  Methods: 
 * 1. add
 * 2. remove
 * 3. items
 * 4. get
 * 5. on (to bind an event)
 * 
 *  Events
 * 1. change
 * 2. add
 * 3. remove
 * 
 *  Optionally and nice to have
 * ----------------------------
 * 1. sort() - method by clicking header name
 * 2. filter(string) - method by using a small icon on the header name
 *  
 *  Bonus Feature
 * 
 *  LAZY RENDERING
 *  --------------
 *  Do not render rows which are not in scroll viewport.
 *  Trigger the rows rendering on scrolling
 * 
 */

// import DynamicGrid from './DynamicGrid'

class DynamicGrid {
  constructor(gridContainer) {
    this.gridContainer = gridContainer;
    this.data = [];
    this.events = {
      change: [],
      add: [],
      remove: [],
    };
    this.renderedRows = [];
    this.scrollHandler = this.lazyRender.bind(this);
  }

  renderRow(item) {
    const row = document.createElement("div");
    row.classList.add("grid-row");

    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.textContent = item[key];
        row.appendChild(cell);
      }
    }

    return row;
  }

  renderGrid() {
    this.gridContainer.innerHTML = "";

    for (const item of this.data) {
      const row = this.renderRow(item);
      this.renderedRows.push(row);
      this.gridContainer.appendChild(row);
    }
  }

  add(item) {
    this.data.push(item);
    this.renderGrid();
    this.triggerEvent("add");
    this.triggerEvent("change");
  }

  remove(index) {
    if (index >= 0 && index < this.data.length) {
      this.data.splice(index, 1);
      const removedRow = this.renderedRows.splice(index, 1)[0];
      this.gridContainer.removeChild(removedRow);
      this.triggerEvent("remove");
      this.triggerEvent("change");
    }
  }

  items() {
    return this.data.slice();
  }

  get(index) {
    if (index >= 0 && index < this.data.length) {
      return this.data[index];
    }
    return undefined;
  }

  on(event, callback) {
    if (this.events.hasOwnProperty(event)) {
      this.events[event].push(callback);
    }
  }

  triggerEvent(event) {
    if (this.events.hasOwnProperty(event)) {
      for (const callback of this.events[event]) {
        callback();
      }
    }
  }

  sort(columnName) {
    const columnIndex = Object.keys(this.data[0]).indexOf(columnName);
    if (columnIndex === -1) {
      console.error(`Column "${columnName}" does not exist.`);
      return;
    }

    this.data.sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB);
      } 
      else {
        return valueA - valueB;
      }
    });

    this.renderGrid();
    this.triggerEvent("change");
  }

  filter(filterString) {
    const filteredData = this.data.filter(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const value = item[key].toString().toLowerCase();
          if (value.includes(filterString.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });

    this.renderFilteredGrid(filteredData);
    this.triggerEvent("change");
  }

  renderFilteredGrid(filteredData) {
    this.gridContainer.innerHTML = "";

    for (const item of filteredData) {
      const row = this.renderRow(item);
      this.renderedRows.push(row);
      this.gridContainer.appendChild(row);
    }
  }

  lazyRender() {
    const containerRect = this.gridContainer.getBoundingClientRect();

    for (const row of this.renderedRows) {
      const rowRect = row.getBoundingClientRect();

      if (rowRect.top >= containerRect.top && rowRect.bottom <= containerRect.bottom) {
        continue; 
      }

      if (rowRect.top > containerRect.bottom || rowRect.bottom < containerRect.top) {
        continue; 
      }
      this.gridContainer.appendChild(row);
    }
  }

  enableLazyRender() {
    this.lazyRender();
    this.gridContainer.addEventListener("scroll", this.scrollHandler);
  }

  disableLazyRender() {
    this.gridContainer.removeEventListener("scroll", this.scrollHandler);
  }
} 


const obj = {
  layout: {
    columns: ['Name', 'Surname', 'Email', 'Gender', 'Age'],
  },
  rows: [
    ['Timmy', 'Snasdell', 'tsnasdell0@senate.gov', 'Male', 58],
    ['Caleb', 'Nisen', 'cnisen1@xing.com', 'Male', 21],
    ['Bil', 'Ohrt', 'bohrt2@opensource.org', 'Male', 58],
    ['Barry', 'Perelli', 'bperelli3@scientificamerican.com', 'Male', 48],
    ['Roderigo', 'Itzkovsky', 'ritzkovsky4@redcross.org', 'Male', 60],
    ['Devland', 'Crothers', 'dcrothers5@netlog.com', 'Agender', 50],
    ['Cletus', 'John', 'cjohn6@state.gov', 'Male', 30],
    ['Bailie', 'Skune', 'bskune7@naver.com', 'Male', 51],
    ['Phyllys', 'Carnell', 'pcarnell8@woothemes.com', 'Female', 35],
    ['Tricia', 'Ibel', 'tibel9@scientificamerican.com', 'Female', 53],
    ['Alf', 'Truett', 'atruetta@moonfruit.com', 'Male', 52],
    ['Myer', 'Yuryshev', 'myuryshevb@hc360.com', 'Genderfluid', 33],
    ['Pen', 'Gierck', 'pgierckc@storify.com', 'Male', 34],
    ['Duncan', 'Lamzed', 'dlamzedd@instagram.com', 'Non-binary', 19],
    ['Cristabel', 'Robertucci', 'crobertuccie@national.com', 'Female', 47],
    ['Orly', 'Copcote', 'ocopcotef@acquirethisname.com', 'Female', 49],
    ['Britney', 'Krolle', 'bkrolleg@google.com', 'Female', 50],
    ['Elle', 'Broadhurst', 'ebroadhursth@joomla.org', 'Female', 39],
    ['Darcee', 'Leverette', 'dleverettei@people.com.cn', 'Non-binary', 42],
    ['Vaclav', 'Caistor', 'vcaistorj@patch.com', 'Agender', 26],
    ['Stace', 'Roy', 'sroyk@sakura.ne.jp', 'Agender', 31],
    ['Yolanthe', 'Morville', 'ymorvillel@sun.com', 'Female', 19],
    ['Ahmad', 'Ghidotti', 'aghidottim@shutterfly.com', 'Male', 39],
    ['Bobina', 'Baudts', 'bbaudtsn@globo.com', 'Female', 57],
    ['Consolata', 'Wheelhouse', 'cwheelhouseo@shareasale.com', 'Female', 50],
    ['Jordon', 'Elstone', 'jelstonep@miitbeian.gov.cn', 'Male', 52],
    ['Theodosia', 'Hansell', 'thansellq@drupal.org', 'Female', 30],
    ['Orsa', 'Faers', 'ofaersr@typepad.com', 'Female', 20],
    ['Xenos', 'Mangan', 'xmangans@techcrunch.com', 'Genderqueer', 35],
    ['Tresa', 'Harmes', 'tharmest@amazon.de', 'Agender', 54],
    ['Rosabelle', 'Godsil', 'rgodsilu@github.com', 'Female', 29],
    ['Radcliffe', 'Esh', 'reshv@comcast.net', 'Male', 48],
    ['Travis', 'Piburn', 'tpiburnw@ow.ly', 'Male', 45],
    ['Lucila', 'Burwell', 'lburwellx@gravatar.com', 'Female', 21],
    ['Dorthea', 'Rawlence', 'drawlencey@reddit.com', 'Female', 28],
    ['Erroll', 'Barnsdall', 'ebarnsdallz@aol.com', 'Male', 25],
    ['Augustus', 'Kliemann', 'akliemann10@yale.edu', 'Male', 39],
    ['Silvan', 'Drennan', 'sdrennan11@accuweather.com', 'Agender', 46],
    ['Jodie', 'Coaten', 'jcoaten12@fema.gov', 'Male', 21],
    ['Alyson', 'Mulhill', 'amulhill13@uiuc.edu', 'Female', 36],
    ['Rina', 'Kid', 'rkid14@arizona.edu', 'Female', 54],
    ['Sharai', 'Tingley', 'stingley15@oracle.com', 'Non-binary', 50],
    ['Lanette', 'Aicken', 'laicken16@shutterfly.com', 'Agender', 29],
    ['Marybeth', 'Dumblton', 'mdumblton17@skype.com', 'Female', 48],
    ['Andy', 'Skures', 'askures18@fotki.com', 'Female', 59],
    ['Dorette', 'Kamall', 'dkamall19@list-manage.com', 'Female', 57],
    ['Cordey', 'MacCulloch', 'cmacculloch1a@newsvine.com', 'Female', 48],
    ['Nickolaus', 'Bloan', 'nbloan1b@ycombinator.com', 'Male', 19],
    ['Grenville', 'Legon', 'glegon1c@de.vu', 'Male', 49],
    ['Sherlocke', 'Kurtis', 'skurtis1d@deliciousdays.com', 'Male', 52],
    ['Abeu', 'Dubock', 'adubock1e@opensource.org', 'Male', 56],
    ['Marlon', 'Pealing', 'mpealing1f@t-online.de', 'Male', 36],
    ['Carita', 'Sanper', 'csanper1g@vimeo.com', 'Agender', 34],
    ['Sibelle', 'Calfe', 'scalfe1h@eepurl.com', 'Female', 41],
    ['Arv', 'Colliard', 'acolliard1i@indiatimes.com', 'Male', 44],
    ['Fiona', 'McSporrin', 'fmcsporrin1j@flavors.me', 'Female', 60],
    ['Haily', 'Stoney', 'hstoney1k@livejournal.com', 'Female', 18],
    ['Mechelle', 'Scarlett', 'mscarlett1l@unc.edu', 'Female', 48],
    ['Donetta', 'Dwelly', 'ddwelly1m@thetimes.co.uk', 'Genderqueer', 59],
    ['Perren', 'Itzcovichch', 'pitzcovichch1n@arstechnica.com', 'Male', 38],
    ['Dietrich', 'Franken', 'dfranken1o@cargocollective.com', 'Male', 37],
    ['Catherine', 'Murrock', 'cmurrock1p@amazon.co.jp', 'Female', 37],
    ['Saba', 'Beany', 'sbeany1q@parallels.com', 'Female', 57],
    ['Cad', 'Davidofski', 'cdavidofski1r@biblegateway.com', 'Male', 47],
    ['Germaine', 'McAviy', 'gmcaviy1s@nifty.com', 'Male', 57],
    ['Gabbie', 'Somerfield', 'gsomerfield1t@multiply.com', 'Male', 55],
    ['Oralia', 'Raw', 'oraw1u@mac.com', 'Female', 42],
    ['Farand', 'Sexcey', 'fsexcey1v@indiegogo.com', 'Female', 52],
    ['Adolphus', 'Borell', 'aborell1w@simplemachines.org', 'Male', 24],
    ['Missy', 'Mouat', 'mmouat1x@shareasale.com', 'Female', 53],
    ['Derward', 'Stanworth', 'dstanworth1y@netscape.com', 'Male', 38],
    ['Betsy', 'Edgson', 'bedgson1z@wiley.com', 'Female', 32],
    ['Dev', 'Merriman', 'dmerriman20@un.org', 'Male', 58],
    ['Romain', 'Headings', 'rheadings21@cbc.ca', 'Male', 60],
    ['Lenora', 'McGookin', 'lmcgookin22@a8.net', 'Female', 25],
    ['Cate', 'Gallaccio', 'cgallaccio23@rambler.ru', 'Female', 23],
    ['Gunner', 'Stallwood', 'gstallwood24@yahoo.co.jp', 'Male', 31],
    ['Loraine', 'MacTeague', 'lmacteague25@wikispaces.com', 'Female', 25],
    ['Rubetta', 'McCleary', 'rmccleary26@bbc.co.uk', 'Female', 49],
    ['Hillier', 'Falvey', 'hfalvey27@addtoany.com', 'Male', 34],
    ['Brod', 'Howle', 'bhowle28@bloglines.com', 'Male', 22],
    ['Ellary', 'Paur', 'epaur29@telegraph.co.uk', 'Male', 39],
    ['Gordy', 'Carayol', 'gcarayol2a@who.int', 'Male', 40],
    ['Fedora', 'Burgoine', 'fburgoine2b@weebly.com', 'Female', 29],
    ['Nealy', 'Burde', 'nburde2c@gmpg.org', 'Male', 58],
    ['Valli', 'Fatscher', 'vfatscher2d@tripod.com', 'Female', 53],
    ['Roxine', 'Licas', 'rlicas2e@mac.com', 'Female', 48],
    ['Edward', 'Tytcomb', 'etytcomb2f@imdb.com', 'Male', 46],
    ['Gayle', 'Ferguson', 'gferguson2g@w3.org', 'Male', 47],
    ['Meir', 'Johanning', 'mjohanning2h@go.com', 'Male', 49],
    ['Wren', 'Corpes', 'wcorpes2i@ebay.com', 'Female', 41],
    ['Oona', 'Soitoux', 'osoitoux2j@elegantthemes.com', 'Female', 34],
    ['Ethelin', 'Ryles', 'eryles2k@slideshare.net', 'Female', 51],
    ['Ari', 'Mulhall', 'amulhall2l@newyorker.com', 'Male', 59],
    ['Reina', 'Earnshaw', 'rearnshaw2m@npr.org', 'Female', 20],
    ['Darrel', 'Antonsson', 'dantonsson2n@aboutads.info', 'Male', 35],
    ['Glenden', 'Rowatt', 'growatt2o@yelp.com', 'Male', 20],
    ['Roderich', 'Andrys', 'randrys2p@constantcontact.com', 'Male', 60],
    ['Erena', 'McLevie', 'emclevie2q@bravesites.com', 'Polygender', 48],
    ['Franky', 'Iacovides', 'fiacovides2r@cbsnews.com', 'Female', 47],
  ],
}

/** 
 * Use the following interface to create new data grid with headers
 * Design, colors, borders is up to you, but try to make clear design.
 */

const host = document.getElementById("grid-container")
const grid = new DynamicGrid(obj, host)

//Implent the following to add a new row 

grid.add(["Hakan", "Özoğlu", "mhozoglu@yandex.com.tr", "Male", 30])

// Implement the following method to remove a row by index
grid.remove(38) //index

// Implement the following method to retrieve the list of all items
grid.items()

// Implement the following method to get the item on the specified index
// Return type can be an array of primitive values i.e. ['Timmy', 'Snasdell', 'tsnasdell0@senate.gov', 'Male', 58]
grid.get(20)

/**
 * Implement the following event handlers
 * 
 * callback fire on change something
 * for eg:
 * grid.on("change",console.log) outputs on change
 *  {
      col: 1
      row: 1
      oldVal: "elma",
      newVal: "portakal"
    }
 */
grid.on("change", callaback) //

/**
 * callback fires on add something
 * for eg.
 * grid.on("add",console.log) outputs on add
 *  {
 *    index: 5,
 *    data : [something]
 *  }
 */
grid.on("add", callaback)

/**
 * callback fires on add something
 * for eg.
 * grid.on("remove",console.log) outputs on add
 *  {
 *    index: 5,
 *    data : [something]
 *  }
 */
grid.on("remove", callback) //callback fires on remove something

/**
 * Additional BONUS Feature
 * ------------------------
 * 
 * contentEditable attribute is not acceptable. We want actual input element on double click.
 * 
 * cell turns to input when double click on it
 * when blur out, it will save data, and will fire change event.
 * 
 * 
 * you can use provided sample data.
 */

