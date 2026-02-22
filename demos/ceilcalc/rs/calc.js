// БЕЗ МАСЛА В ГОЛОВЕ НЕ ЛЕЗТЬ!

// Helper для наследования
// http://javascript.ru/tutorial/object/inheritance#nasledovanie-na-klassah-funkciya-extend

function extend(Child, Parent) {
	var F = function() { };
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}

// Заменяем запятую на точку, возвращаем вещественное число
// http://stackoverflow.com/questions/642650/how-to-convert-string-into-float-in-javascript

// входной параметр может быть как числом так и строкой
// возвращаем всегда число, либо пустую строку
// 
function float(x) {
	// преобразуем в строку 
	x = x + '';
	// заменяем запятую на точку
	x = x.replace(',','.');
	// если у нас больше точек чем одна - ошибка
	var re = /\..*\./;
	if ( re.test(x) ) {
		return '';
	}
	// если точка одна, считаем знаки после запятой, преобразуем к требуемой точнойти, возвращаем
	re = /\./;
	if ( re.test(x) ) {
		re = /\d+\.\d+/;
		if ( re.test(x) ) {
			p = x.match(/\.(\d+)$/);
			x = parseFloat(x);
			return x.toFixed(p[1].length);
		}
		else {
			return '';
		}
	}
	// если точки нет - возвращем преобразованное к инт число
	re = /^\d+$/;
	if ( re.test(x) ) {
		return parseInt(x);
	}
}

// проверка что целое число
// входной параметр может быть как числом так и строкой
// возвращаем всегда число, если ошибка - нуль
// 
function integer(x) {
	// преобразуем в строку 
	x = x + '';
	// если точки нет - возвращем преобразованное к инт число
	var re = /^\d+$/;
	if ( re.test(x) ) {
		return parseInt(x);
	}
	else {
		return 0;
	}
}


// Расставляем разделители разрядов
// https://github.com/kvz/phpjs/blob/master/functions/strings/number_format.js
// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return parts.join(".");
}
	
// Выравниваем поля, где есть размерность (в третьем bootstrap'е это будет уже «из коробки»)
function equalizeAddOn () {
	var span2_width = $("input.span2").width();
	$(".input-append").each(function(){
		$( this ).find('input.span2').width( span2_width - $( this ).find('.add-on').width() - 12  );
	});
}

$(document).on("shown", "a[data-toggle='tab']",function(){
	equalizeAddOn();
});

// Активируем всплывающие подсказки popover'ы

function initPopovers () {
	$('.header-parameters span.popover-label').attr('data-placement','bottom');
	$('.primary-parameters span.popover-label').attr('data-placement','bottom');
	$('.extra-parameters span.popover-label').attr('data-placement','top');
	
	$('span.popover-label').popover({ 
		html    : true,
		trigger : 'hover',
		container: 'body',
		content : function() {
			return $( 'div.popover-data .' + $(this).attr('data-ref') ).html();
		},
		title : function() {
			return $( '.' + $(this).attr('data-ref') ).attr('title') ? $( '.' + $(this).attr('data-ref') ).attr('title') : $(this).text();
		}
	});
}

// Массив потолков

var seilingList = new Array();

// Функция индекс seilingList объекта потолка по имени поля
// (в имени поля указано значение счётчика объектов)
// не само значение счётчика!! а индекс массива!! (может отличаться)
function seilingByName (name) {
	// btn-delete23
	var n = name.match(/(\d+)/);
	// находим объект с этим индексом
	var i;
	for (i = 0; i < seilingList.length; ++i) {
		
		var oldValue = $('select[name="pvc-texture'+this.index+'"]').val();
		var area = Math.ceil( float( $('input[name="pvc-area'+this.index+'"]').val() ) );

		$('select[name="pvc-texture'+this.index+'"]').html('');
		$('select[name="pvc-texture'+this.index+'"]').append('<option value="0">Nije izabrano</option>');
		
		
		if (n[0] == seilingList[i].index) {
			return(i);
		}
	}
	return(0);
}

// Проходим по всем потолкам и заполняем данными о стоимости + применяем скидки + сортируем влкадки

function calculate () {
	var i;
	for (i = 0; i < seilingList.length; ++i) {
		seilingList[i].textureDiscountSum = seilingList[i].textureSum;
		seilingList[i].totalSum = seilingList[i].textureDiscountSum + seilingList[i].optionsSum;
		$('div#seiling' + seilingList[i].index + ' .main-alert-info .texture-sum').text( numberWithCommas( seilingList[i].textureSum ) );
		$('div#seiling' + seilingList[i].index + ' .main-alert-info .options-sum').text( numberWithCommas( seilingList[i].optionsSum ) );
	}
	sortSeilings();
}

// Проходим по всем потолкам и заполняем данными по светильникам и лампам

function updateLampLight () {
	var c = $('select[name=company]').val();
	if (c) {
		// убираем плашку с предупреждением
		$('.error-firm').show();
		if (seilingList.length>0) {
			$('.no-seilings').hide();
		}
		else {
			// Показываем заглушку про «нету потолков»
			$('.no-seilings').show();
		}
		
		$('ul.nav-tabs li a#tab' + this.index).removeClass('error');
		$('div.company').removeClass('has-error');
		
		// заполняем все потолки данными
		// (по очереди - так как в случае перезаполнения где-то могли быть выбраны светильники и/или лампы)
		// после заполнения очередного потолка, запускаем его пересчёт (провека может не пройти - в случае подарков)

		var j;
		for (j = 0; j < seilingList.length; ++j) {
		
// Прописываем список со светильниками
			var oldValue = $('select[name*="light-type'+seilingList[j].index+'"]').val();

			$('select[name*="light-type'+seilingList[j].index+'"]').html('');
			$('select[name*="light-type'+seilingList[j].index+'"]').append('<option value="0" data-price="0">Nije izabrano</option>');

			var i;
			for (i = 0; i < lamp.length; ++i) {
				var s = '<option value="'+ lamp[i].id +'"';
				if ( c == 'firm1' ) {
					s = s + ' data-price="' + numberWithCommas(lamp[i].price1) + '">';
					s = s + lamp[i].title;
					s = s + '; ' + numberWithCommas(lamp[i].price1) + ' €';
				}
				else {
					s = s + ' data-price="' + numberWithCommas(lamp[i].price2) + '">';
					s = s + lamp[i].title;
					if ( lamp[i].price2 > 0 ) {
						s = s + '; ' + numberWithCommas(lamp[i].price2) + ' €';
					}
					else {
						s = s + '; gratis uz kupovinu sijalice';
					}
				}
				s = s + '</option>';
	
				$('select[name*="light-type'+seilingList[j].index+'"]').append(s);
			}

			$('select[name*="light-type'+seilingList[j].index+'"] option[value="' + oldValue + '"]').prop('selected', true);

// Прописываем список с лампами

			var oldValue = $('select[name*="light-bulb'+seilingList[j].index+'"]').val();

			$('select[name*="light-bulb'+seilingList[j].index+'"]').html('');
			$('select[name*="light-bulb'+seilingList[j].index+'"]').append('<option value="0" data-price="0">Nije izabrana</option>');

			for (i = 0; i < lamp.length; ++i) {
				var s = '<option value="'+ light[i].id +'"';
				if ( c == 'firm1' ) {
					s = s + ' data-price="' + numberWithCommas(light[i].price1) + '">';
					s = s + light[i].title;
					s = s + '; ' + numberWithCommas(light[i].price1) + ' €';
				}
				else {
					s = s + ' data-price="' + numberWithCommas(light[i].price2) + '">';
					s = s + light[i].title;
					s = s + '; ' + numberWithCommas(light[i].price2) + ' €';
				}
				s = s + '</option>';

				$('select[name*="light-bulb'+seilingList[j].index+'"]').append(s);

			}

			$('select[name*="light-bulb'+seilingList[j].index+'"] option[value="' + oldValue + '"]').prop('selected', true);

			seilingList[j].calculate();
		}
		
	}
	
}

// Определяем функцию порядка для массива потолков
// http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects


// Сортируем потолки, просчитываем скидки по каждому

function sortSeilings() {
	// Получаем [внутренний!] индекс активного потолка
	// #seiling23
	var href = $('ul.nav-tabs li.active a').attr('href');
//	console.log(href);
	var n = href.match(/(\d+)/);
//	console.log(n[0]);
	
	// Сортируем
//	console.log(seilingList);
	seilingList.sort(function(a,b) {
		if ( (a.type == 'ПВХ' && b.type == 'ПВХ') || (a.type == 'Ткань' && b.type == 'Ткань') ) { return parseFloat(b.textureSum) - parseFloat(a.textureSum); };
		if (a.type == 'Ткань' && b.type == 'ПВХ') { return 1 };
		if (a.type == 'ПВХ' && b.type == 'Ткань') { return -1 };
	});
//	console.log(seilingList);


	// формируем список закладок отсортированных потолков
	
	var s = '';
	var j;
	for (j = 0; j < seilingList.length; ++j) {
		if ( seilingList[j].index == n[0] ) {
			s = s + '<li class="active">'
		}
		else {
			s = s + '<li>'
		}
		s = s + '<a href="#seiling' + seilingList[j].index + '" id="tab' + seilingList[j].index + '" data-toggle="tab"></a></li>';
	}

	$('ul.nav-tabs').html(s);
	
	// Опеределяем скидки в зависимости от компании

	var odd1,odd2,even1,even2;
	for (j = 0; j < company.length; ++j) {
		if ( company[j].id == $('select[name=company]').val() ) {
			odd1  = company[j].odd1;
			odd2  = company[j].odd2;
			even1 = company[j].even1;
			even2 = company[j].even2;
		}
	}

	// Обновляем ярлычки (красим в красный, что требуется; ... )
	
	totalSum = 0;
	
	for (j = 0; j < seilingList.length; ++j) {
		seilingList[j].setTabTitle();
		if (parseFloat(seilingList[j].textureSum) == 0) {
			seilingList[j].showError();
		}
		
		// нечётные ПВХ потолки (j начинается с нуля!)
		if (j % 2 == 0 && seilingList[j].type == 'ПВХ') {
			seilingList[j].textureDiscountSum = 
				seilingList[j].textureSum - seilingList[j].textureSum * odd1/100
			seilingList[j].textureDiscountSum = 
				seilingList[j].textureDiscountSum - seilingList[j].textureDiscountSum * odd2/100
			seilingList[j].discount = ''+odd1+'+'+odd2;
			seilingList[j].discountType = 'neparni plafon';
		}
		// чётные ПВХ потолки (j начинается с нуля!)
		if (j % 2 == 1 && seilingList[j].type == 'ПВХ') {
			seilingList[j].textureDiscountSum = 
				seilingList[j].textureSum - seilingList[j].textureSum * even1/100
			seilingList[j].textureDiscountSum = 
				seilingList[j].textureDiscountSum - seilingList[j].textureDiscountSum * even2/100
			seilingList[j].discount = ''+even1+'+'+even2;
			seilingList[j].discountType = 'parni plafon';
		}
		
		seilingList[j].textureDiscountSum = Math.ceil( parseFloat(seilingList[j].textureDiscountSum ) );
		
		seilingList[j].totalSum = seilingList[j].textureDiscountSum + seilingList[j].optionsSum;
		totalSum = totalSum + seilingList[j].totalSum;

		seilingList[j].setTabTitle();
		
		$('div#seiling' + seilingList[j].index + ' .main-alert-info .texture-discount-sum').text( numberWithCommas( seilingList[j].textureDiscountSum ) );
		$('div#seiling' + seilingList[j].index + ' .main-alert-info .discount-value').text( seilingList[j].discount );
		$('div#seiling' + seilingList[j].index + ' .main-alert-info .discount-type').text( seilingList[j].discountType );
	}
	
	// разбираемся с общей скидкой на весь расчёт
	var totalDiscount = 0; //  скидка на весь расчёт (из интерфейса временно удалена; в алгоритме остались следы)

	totalSum = Math.ceil( parseFloat( totalSum - totalSum * totalDiscount / 100 ) );
	
	$('span.main-total-sum').text( numberWithCommas( totalSum ) );
	
}


// Класс "Потолок" (базовый класс)

function Seiling() {
	seilingList.push(this);
	
	this.totalSum = 0;
	this.textureSum = 0; 
	this.textureDiscountSum = 0; // со скидкой
	this.optionsSum = 0;
	this.discount = ''; // текстовая строка со скидкой
	this.discountType = ''; // текстовая строка с описанием скидки
	
	
	// Потолок знает свой индекс (индекс закладки, контейнера формы и полей формы)
	this.index = ++ Seiling.index;
	
	// При создании [любого] потолка, создаём закладку
	$('ul.nav-tabs li.active').removeClass('active');
	$('ul.nav-tabs').append('<li class="active"><a href="#seiling' + this.index + '" id="tab' + this.index + '" data-toggle="tab"></a></li>');
	this.title = $('input[name="ceiling-name"]').val();
	$('input[name="ceiling-name"]').val('');

	this.type = '';

	// Скрываем заглушку про «нету потолков»
	$('.no-seilings').hide();
	$('.seilings-list').show();
	
}

Seiling.prototype.flush = function() {
	this.totalSum = 0;
	this.textureSum = 0;
	this.textureDiscountSum = 0; // со скидкой
	this.optionsSum = 0;
	this.discount = '';
}

Seiling.prototype.setTabTitle = function() {
	var typeLabel = this.type;
	if (typeLabel == 'ПВХ') { typeLabel = 'PVC'; }
	if (typeLabel == 'Ткань') { typeLabel = 'Tkanina'; }
	if (this.totalSum) {
		$('ul.nav-tabs li a#tab'+this.index).html( this.title + " • " + typeLabel + " • " + numberWithCommas(this.totalSum) );
	}
	else {
		$('ul.nav-tabs li a#tab'+this.index).html( this.title + " • " + typeLabel );
	}
}

Seiling.prototype.show = function() {
	$('ul.nav-tabs li a#tab'+this.index).tab('show');
	$('.tab-content .tab-pane').removeClass('active');
	$('.tab-content #seiling'+this.index).addClass('active');
	equalizeAddOn();
}

Seiling.prototype.delete = function() {
	$('ul.nav-tabs li a#tab'+this.index).parent('li').remove();
	$('.tab-content #seiling'+this.index).remove();
	
	var i;
	for (i = 0; i < seilingList.length; ++i) {
		if (this.index == seilingList[i].index) {
			seilingList.splice(i,1);
			break;
		}
	}
	// Делаем активным потолок либо предыдущий (если он был; не первый удаляли)
	if (i>0) {
		seilingList[i-1].show();
	}
	else {
		// .. либо первый, если вообще есть потолки
		if (seilingList.length>0) {
			seilingList[0].show();
		}
		else {
			// Показываем заглушку про «нету потолков»
			$('.no-seilings').show();
			$('.seilings-list').hide();
		}
	}

	sortSeilings();
}

Seiling.prototype.clone = function(templateId,index) {
	// Дублируем форму
	var content = $('div.seiling-data '+templateId).clone();
	// Создаём объект jQuery и обновляем названия всех полей
	content.find('input,select,textarea,button').each(function(){
		$(this).attr('name' , $(this).attr('name') + index);
	});
	
	// Создаём содержимое вкладки
	$('.tab-content').append( '<div class="tab-pane" id="seiling'+index+'">' + content.html() + '</div>');

	// Прописываем название
	$('.tab-content').find('input[name="ceiling-name'+index+'"]').val(this.title);
	
	// Подключаем popover'ы
	initPopovers();

	updateLampLight();
	
}

Seiling.prototype.init = function() {
	// Переименовываем [новую] вкладку
	this.setTabTitle();
	// Показываем [новую] вкладку
	this.show();
	this.updateTexture();
	this.calculate();
	sortSeilings();
}

// Проверяет, все ли данные доступны для вычисления, нет ли ошибок, некорректных данных
// Раскраска закладок, полей и вывод диагностических сообщений происходит тут
// возвращает true, если можно дальше работать (считать); false в случае наличия ошибок
Seiling.prototype.commonCheck = function() {

	var noError = true;
	
	// фактура ПВХ Ткань

	if ($('div#seiling' + this.index + ' select[name*="texture' + this.index + '"]').val() == 0) {
		$('div#seiling' + this.index + ' div.texture').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.texture').removeClass('has-error');
	}

	var div;
	// Обход трубы / Углы / Люстра / Монтаж свет-ка
	div = $('div#seiling' + this.index + ' input[name*="bypassing-tube' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.bypassing-tube').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.bypassing-tube').removeClass('has-error');
	}
	// Углы
	div = $('div#seiling' + this.index + ' input[name*="corners' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.corners').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.corners').removeClass('has-error');
	}
	// Люстра
	div = $('div#seiling' + this.index + ' input[name*="chandelier' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.chandelier').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.chandelier').removeClass('has-error');
	}
	// Монтаж свет-ка
	div = $('div#seiling' + this.index + ' input[name*="luminaire' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.luminaire').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.luminaire').removeClass('has-error');
	}
	
// Дополнительные параметры

	// Керамогранит
	div = $('div#seiling' + this.index + ' input[name*="keramogranit' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.keramogranit').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.keramogranit').removeClass('has-error');
	}
	// Закарнизное пространство
	div = $('div#seiling' + this.index + ' input[name*="soffit-space' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.soffit-space').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.soffit-space').removeClass('has-error');
	}
	// Брус
	div = $('div#seiling' + this.index + ' input[name*="timber' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.timber').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.timber').removeClass('has-error');
	}
	// Потолочный багет
	div = $('div#seiling' + this.index + ' input[name*="ceiling-moldings' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.ceiling-moldings').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.ceiling-moldings').removeClass('has-error');
	}
	// Установка светодиодной ленты
	div = $('div#seiling' + this.index + ' input[name*="led-strip' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.led-strip').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.led-strip').removeClass('has-error');
	}
	// Криволинейность
	div = $('div#seiling' + this.index + ' input[name*="curvilinearity' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.curvilinearity').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.curvilinearity').removeClass('has-error');
	}
	// Внутренний вырез
	div = $('div#seiling' + this.index + ' input[name*="inner-cut' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.inner-cut').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.inner-cut').removeClass('has-error');
	}
	// Отверстие под вентиляцию
	div = $('div#seiling' + this.index + ' input[name*="ventilation' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.ventilation').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.ventilation').removeClass('has-error');
	}
	// Монтаж вытяжки
	div = $('div#seiling' + this.index + ' input[name*="air-vent' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.air-vent').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.air-vent').removeClass('has-error');
	}
	// Потол. карниз (точка крепления)
	div = $('div#seiling' + this.index + ' input[name*="ceiling-cornice' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.ceiling-cornice').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.ceiling-cornice').removeClass('has-error');
	}
	// Установка трансформатора, констроллера
	div = $('div#seiling' + this.index + ' input[name*="transformer' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.transformer').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.transformer').removeClass('has-error');
	}
	// Установка датчика
	div = $('div#seiling' + this.index + ' input[name*="sensor' + this.index + '"]').val();
	if ( div.length > 0 && integer(div) == 0 ) {
		$('div#seiling' + this.index + ' div.sensor').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.sensor').removeClass('has-error');
	}
	// Разделитель
	div = $('div#seiling' + this.index + ' input[name*="separator' + this.index + '"]').val();
	if ( div ) {
		if ( div.length > 0 && integer(div) == 0 ) {
			$('div#seiling' + this.index + ' div.separator').addClass('has-error');
			noError = false;
		}
		else {
			$('div#seiling' + this.index + ' div.separator').removeClass('has-error');
		}
	}
	// Арт-печать
	div = $('div#seiling' + this.index + ' input[name*="art-prints' + this.index + '"]').val();
	var noArtError = true;
	if ( div ) {
		if ( div.length > 0 && float(div) == '' ) {
			noArtError = false;
		};
		if ( $('select[name="pvc-texture'+this.index+'"]').val() > 0 ) {
			var i;
			for (i = 0; i < pvhTexture.length; ++i) {
				if ( pvhTexture[i].id == $('select[name="pvc-texture'+this.index+'"]').val() ) {
					if ( pvhTexture[i].type == '' ) {
						noArtError = false;
					}
				}
			}
		};
//		if ( float(div) > 0 && float(div) > float(area) && float(area) > 0 ) {
//			noArtError = false;
//		}
		
		if (noArtError) {
			$('div#seiling' + this.index + ' div.art-prints').removeClass('has-error');
		}
		else {
			$('div#seiling' + this.index + ' div.art-prints').addClass('has-error');
			noError = false;
		}
	}
	
	
	// указан светильник, но не указано количество ПВХ Ткань
	var light_type = $('div#seiling' + this.index + ' select[name*="light-type' + this.index + '"]').val();
	var lamp = $('div#seiling' + this.index + ' input[name*="lamp' + this.index + '"]').val();
	if ( light_type > 0 && ( isNaN(integer(lamp)) || integer(lamp) <= 0 ) ) {
		$('div#seiling' + this.index + ' div.light-count').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.light-count').removeClass('has-error');
	}

	// указан светильник в подарок, но не указана лампа ПВХ Ткань
	var light_bulb = $('div#seiling' + this.index + ' select[name*="light-bulb' + this.index + '"]').val();
	var light_type = $('div#seiling' + this.index + ' select[name*="light-type' + this.index + '"]').val();
	var light_type_price = $('div#seiling' + this.index + ' select[name*="light-type' + this.index + '"] option:selected').attr('data-price');
	if ( light_type>0 && light_type_price==0 && light_bulb==0 ) {
		$('div#seiling' + this.index + ' div.light-bulb').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.light-bulb').removeClass('has-error');
	}
	
	return noError;
}

Seiling.prototype.hideError = function() {
	$('ul.nav-tabs li a#tab' + this.index).removeClass('error');
	$('div#seiling' + this.index + ' .main-alert-info').show();
	$('div#seiling' + this.index + ' .main-alert-error').hide();
	
}
Seiling.prototype.showError = function() {
	$('ul.nav-tabs li a#tab' + this.index).addClass('error');
	$('div#seiling' + this.index + ' .main-alert-info').hide();
	$('div#seiling' + this.index + ' .main-alert-error').show();

	$('div#seiling' + this.index + ' .tex-calc').slideUp();
}

// Класс "Потолок ПВХ" (наследование от "Потолок" - ниже)

function PVCSeiling() {
	PVCSeiling.superclass.constructor.apply(this);
	
	PVCSeiling.counter++;
	this.title = this.title ? this.title : 'Plafon ' + PVCSeiling.counter;
	this.type = 'ПВХ';
	
	this.clone('#pvc',this.index);

	this.init();
}

// Класс "Потолок Ткань" (наследование от "Потолок" - ниже)

function TexSeiling() {
	TexSeiling.superclass.constructor.apply(this);

	TexSeiling.counter++;
	this.title = this.title ? this.title : 'Plafon ' + TexSeiling.counter;
	this.type = 'Ткань';

	this.clone('#tex',this.index);
	
	this.init();
}


// Объявляем наследование "Потолок ПВХ" и "Потолок Ткань" от "Потолок"

extend(PVCSeiling, Seiling);
extend(TexSeiling, Seiling);

// Объявляем счётчики

// При дублировании формы потолка необходимо менять названия полей (чтобы работала отправка форм)
// Все потолки нумеруются по мере создания. В случае удаления перенумерации не происходит
Seiling.index = 0; // Сквозная нумерация для всех потолков (1..n)

PVCSeiling.counter = 0; // Сквозная нумерация для потолков ПВХ для noname-закладок (1..k)
TexSeiling.counter = 0; // Сквозная нумерация для потолков Ткань для noname-закладок (1..l)

// Отновление текстуры данными (ПВХ)

PVCSeiling.prototype.updateTexture = function() {
	var oldValue = $('select[name="pvc-texture'+this.index+'"]').val();

// округление площади 0-25
	area = Math.ceil( float( $('div#seiling' + this.index + ' .real-area').text() ) - 0.24 );
	if (!area) {
		area = Math.ceil( float( $('input[name="pvc-area'+this.index+'"]').val() ) - 0.24 );
	}

	$('select[name="pvc-texture'+this.index+'"]').html('');
	$('select[name="pvc-texture'+this.index+'"]').append('<option value="0">Nije izabrano</option>');
	
	var i;
	for (i = 0; i < pvhTexture.length; ++i) {
		var s = '<option value="'+ pvhTexture[i].id +'">'+ pvhTexture[i].title;
		if ( !(isNaN(area) ) && area > 0 ) {
			switch( true ) {
				case (area < 6):
					s = s + '; 1 m²: ' + numberWithCommas(pvhTexture[i].a0) + ' €, ukupno: ' + numberWithCommas(pvhTexture[i].a0 * area) + ' €';
					break;
				case (area < 11):
					s = s + '; 1 m²: ' + numberWithCommas(pvhTexture[i].a5) + ' €, ukupno: ' + numberWithCommas(pvhTexture[i].a5 * area) + ' €';
					break;
				case (area < 21):
					s = s + '; 1 m²: ' + numberWithCommas(pvhTexture[i].a10) + ' €, ukupno: ' + numberWithCommas( pvhTexture[i].a10 * area) + ' €';
					break;
				default:
					s = s + '; 1 m²: ' + numberWithCommas(pvhTexture[i].a21) + ' €, ukupno: ' + numberWithCommas( pvhTexture[i].a21 * area) + ' €';
			}
		}
		
		s = s + '</option>';
		
		$('select[name="pvc-texture'+this.index+'"]').append(s);
		
	}
	
	$('select[name="pvc-texture'+this.index+'"] option[value="' + oldValue + '"]').prop('selected', true);
}

// Вычисление промежуточных периметра и площади (ПВХ)

PVCSeiling.prototype.calculateAreaPerimeter = function() {
	var lengthVal = $('div#seiling' + this.index + ' input[name*="length' + this.index + '"]').val();
	var widthVal = $('div#seiling' + this.index + ' input[name*="width' + this.index + '"]').val();
	var areaVal = $('div#seiling' + this.index + ' input[name="pvc-area' + this.index + '"]').val();
	var perimeterVal = $('div#seiling' + this.index + ' input[name="pvc-perimeter' + this.index + '"]').val();

	var calcPerimeter = 0, calcArea = 0;
	if ( float( lengthVal ) > 0 && float( widthVal ) > 0 ) {
		// считаем периметр на основе длины и ширины
		$('.perimeter-type').text('Obim na osnovu dužine i širine, m:');

		calcPerimeter = ( parseFloat(float( lengthVal )) + parseFloat(float( widthVal )) ) * 2;
		calcPerimeter = calcPerimeter.toFixed(2);
		$('div#seiling' + this.index + ' .calc-perimeter').html( calcPerimeter );

		// считаем площадь на основе длины и ширины
		calcArea = parseFloat(float( lengthVal )) * parseFloat(float( widthVal ));
		calcArea = calcArea.toFixed(2);
		$('div#seiling' + this.index + ' .calc-area').html( calcArea );
	}
	else {
		$('.perimeter-type').text('Obim na osnovu površine, m:');

		calcPerimeter = Math.sqrt( float(areaVal) ) * 4 ;
		calcPerimeter = calcPerimeter.toFixed(2);
		$('div#seiling' + this.index + ' .calc-perimeter').html( calcPerimeter );
	}
	
	// Разбираемся с периметром для вычислений
	
	var perimeter;
	if ( perimeterVal ) {
		if ( float(perimeterVal) > 0 ) {
			perimeter = parseFloat(float( perimeterVal ));
		}
	}
	
	if (perimeter > 0) {
		perimeter = perimeter.toFixed(2);
	}
	else {
		perimeter = calcPerimeter;
	}
	$('div#seiling' + this.index + ' .real-perimeter').html( perimeter );

	// Разбираемся с площадбю для вычислений
	
	var area;
	if ( areaVal ) {
		if ( float(areaVal) > 0 ) {
			area = parseFloat(float( areaVal ));
		}
	}
	
	if (area > 0) {
		area = area.toFixed(2);
	}
	else {
		area = calcArea;
	}
	$('div#seiling' + this.index + ' .real-area').html( area );
	
	this.updateTexture();
}

// Вычисление стоимости (ПВХ)

PVCSeiling.prototype.check = function() {
	var noError = this.commonCheck();

	// обязательные поля при инициализации: длина, ширина, площадь
	var isArea=false,isLength=false,isWidth=false;
	var areaError = false,lengthError = false,widthError = false;
	// площадь ПВХ
	var area = $('div#seiling' + this.index + ' input[name*="area' + this.index + '"]').val();
	if ( isNaN(float(area)) || float(area) <= 0 ) {
		$('div#seiling' + this.index + ' div.area').addClass('has-error');
		areaError = true;
	}
	else {
		$('div#seiling' + this.index + ' div.area').removeClass('has-error');
		isArea=true;
	}

	// длина
	var length = $('div#seiling' + this.index + ' input[name*="length' + this.index + '"]').val();
	if ( isNaN(float(length)) || float(length) <= 0 ) {
		$('div#seiling' + this.index + ' div.length').addClass('has-error');
		lengthError = true;
	}
	else {
		$('div#seiling' + this.index + ' div.length').removeClass('has-error');
		isLength=true;
	}

	// ширина
	var width = $('div#seiling' + this.index + ' input[name*="width' + this.index + '"]').val();
	if ( isNaN(float(width)) || float(width) <= 0 ) {
		$('div#seiling' + this.index + ' div.width').addClass('has-error');
		widthError = true;
	}
	else {
		$('div#seiling' + this.index + ' div.width').removeClass('has-error');
		isWidth=true;
	}
	
	// если введены длина и ширина, то площадь становится необязательным (но она должна быть тогда пустой)
	if (isLength && isWidth && area.length==0) {
		$('div#seiling' + this.index + ' div.area').removeClass('has-error');
		areaError = false;
	}

	if (isLength && isWidth) {
		$('div#seiling' + this.index + ' .pvc-area').slideDown();
		$('div#seiling' + this.index + ' .pvc-perimeter').slideDown();
		this.calculateAreaPerimeter();
	}
	// если введена площадь, то длина и ширина становятся необязательными (но они должны быть тогда пустыми)
	if (isArea && width.length==0 ) {
		$('div#seiling' + this.index + ' div.width').removeClass('has-error');
		widthError = false;

		$('div#seiling' + this.index + ' .pvc-area').slideUp();
		$('div#seiling' + this.index + ' .pvc-perimeter').slideDown();
		this.calculateAreaPerimeter();
	}
	if (isArea && length.length==0 ) {
		$('div#seiling' + this.index + ' div.length').removeClass('has-error');
		lengthError = false;

		$('div#seiling' + this.index + ' .pvc-area').slideUp();
		$('div#seiling' + this.index + ' .pvc-perimeter').slideDown();
		this.calculateAreaPerimeter();
	}
	
	if (areaError || lengthError || widthError) {
		noError = false;
		$('div#seiling' + this.index + ' .pvc-area').slideUp();
		$('div#seiling' + this.index + ' .pvc-perimeter').slideUp();
	}
	
	
	if (noError) {
		this.hideError();
	}
	else {
		this.showError();
		this.flush();
		sortSeilings();
	}
	return noError;
}

PVCSeiling.prototype.calculate = function() {
	if ( this.check() ) {

// округление площади 0-25
		var area = Math.ceil( parseFloat( $('div#seiling' + this.index + ' .real-area').html() ) - 0.24 );

		var perimeter = Math.ceil( parseFloat( $('div#seiling' + this.index + ' .real-perimeter').html() ) );

		var texture;

		var i;
		for (i = 0; i < pvhTexture.length; ++i) {
			if ( pvhTexture[i].id == $('select[name="pvc-texture'+this.index+'"]').val() ) {
				switch( true ) {
					case (area < 6):
						texture = pvhTexture[i].a0;
						break;
					case (area < 11):
						texture = pvhTexture[i].a5;
						break;                           
					case (area < 21):                    
						texture = pvhTexture[i].a10;
						break;                           
					default:                             
						texture = pvhTexture[i].a21;
				}
			}
		}

		this.textureSum = area * texture;
		
		this.optionsSum = 0;

		if ( $('div#seiling' + this.index + ' input[name*="baguette"]:checked').val()==1 ) {
			this.optionsSum =  this.optionsSum + perimeter * options.baguettePlastic;
		}
		if ( $('div#seiling' + this.index + ' input[name*="baguette"]:checked').val()==2 ) {
			this.optionsSum =  this.optionsSum + perimeter * options.baguetteAluminium;
		}

		if ( $('div#seiling' + this.index + ' input[name*="masking-tape"]:checked').val()==1 ) {
			this.optionsSum =  this.optionsSum + perimeter * options.maskingTapeNo;
		}
		if ( $('div#seiling' + this.index + ' input[name*="masking-tape"]:checked').val()==2 ) {
			this.optionsSum =  this.optionsSum + perimeter * options.maskingTapeWhite;
		}
		if ( $('div#seiling' + this.index + ' input[name*="masking-tape"]:checked').val()==3 ) {
			this.optionsSum =  this.optionsSum + perimeter * options.maskingTapeBlack;
		}
		if ( $('div#seiling' + this.index + ' input[name*="masking-tape"]:checked').val()==4 ) {
			// округляем периметр до числа кратного 5 в большую сторону
			this.optionsSum =  this.optionsSum + (Math.floor((perimeter-1)/5)*5+5) * options.maskingTapeColor;
		}

		var div;
		// Обход трубы
		div = $('div#seiling' + this.index + ' input[name*="bypassing-tube' + this.index + '"]').val();

		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.bypassingTube;
		}
		// Углы
		div = $('div#seiling' + this.index + ' input[name*="corners' + this.index + '"]').val();
		if ( (integer(div) > 0) && (integer(div) <= 4) ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.corner;
		}
		if ( integer(div) > 4 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.corner4;
		}
		// Люстра
		div = $('div#seiling' + this.index + ' input[name*="chandelier' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.chandelier;
		}

		div = $('div#seiling' + this.index + ' input[name*="luminaire' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.luminaire;
		}
		// Монтаж свет-ка
		var lamp = $('div#seiling' + this.index + ' input[name*="lamp' + this.index + '"]').val();
		if ( !isNaN(float(lamp)) && float(lamp) > 0 ) {
			this.optionsSum = this.optionsSum + float(lamp) * parseInt( $('div#seiling' + this.index + ' select[name*="light-type' + this.index + '"] option:selected').attr('data-price') );
			this.optionsSum = this.optionsSum + float(lamp) * parseInt( $('div#seiling' + this.index + ' select[name*="light-bulb' + this.index + '"] option:selected').attr('data-price') );
		}
		
		
	// Дополнительные параметры

		// Керамогранит
		div = $('div#seiling' + this.index + ' input[name*="keramogranit' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.keramogranit;
		}
		// Закарнизное пространство
		div = $('div#seiling' + this.index + ' input[name*="soffit-space' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.soffitSpace;
		}
		// Брус
		div = $('div#seiling' + this.index + ' input[name*="timber' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.timber;
		}
		// Потолочный багет
		div = $('div#seiling' + this.index + ' input[name*="ceiling-moldings' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.pvhCeilingMoldings;
		}
		else {
			$('div#seiling' + this.index + ' div.ceiling-moldings').removeClass('has-error');
		}
		// Установка светодиодной ленты
		div = $('div#seiling' + this.index + ' input[name*="led-strip' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.ledStrip;
		}
		// Криволинейность
		div = $('div#seiling' + this.index + ' input[name*="curvilinearity' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.curvilinearity;
		}
		// Внутренний вырез
		div = $('div#seiling' + this.index + ' input[name*="inner-cut' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.innerCut;
		}
		// Отверстие под вентиляцию
		div = $('div#seiling' + this.index + ' input[name*="ventilation' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.ventilation;
		}
		// Монтаж вытяжки
		div = $('div#seiling' + this.index + ' input[name*="air-vent' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.airVent;
		}
		// Потол. карниз (точка крепления)
		div = $('div#seiling' + this.index + ' input[name*="ceiling-cornice' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.ceilingCornice;
		}
		// Установка трансформатора, констроллера
		div = $('div#seiling' + this.index + ' input[name*="transformer' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.transformer;
		}
		// Установка датчика
		div = $('div#seiling' + this.index + ' input[name*="sensor' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.sensor;
		}
		// Разделитель
		div = $('div#seiling' + this.index + ' input[name*="separator' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.separator;
		}
		
		// Арт-печать
		div = $('div#seiling' + this.index + ' input[name*="art-prints' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			// Определяем тип полотна
			
			var i;
			var type;
			for (i = 0; i < pvhTexture.length; ++i) {
				if ( pvhTexture[i].id == $('select[name="pvc-texture'+this.index+'"]').val() ) {
					type = pvhTexture[i].type;
				}
			}
			
			// В зависимости от площади и типа (используя сетку тарифов), получаем цену артпечати

			var art;
			switch( true ) {
				case (integer(div) < 6):
					art = artPrint[type].a0;
					break;
				case (integer(div) < 11):
					art = artPrint[type].a5;
					break;                           
				case (integer(div) < 21):                    
					art = artPrint[type].a10;
					break;                           
				default:                             
					art = artPrint[type].a21;
			}

			this.textureSum =  this.textureSum + integer(div) * art;
		}
		
		// Центровка шва
		if ( $('div#seiling' + this.index + ' input[name*="seam-alignment' + this.index + '"]:checked').length > 0 ) {
			this.textureSum =  this.textureSum + this.textureSum * ( options.seamAlignment / 100 );
		}
		
		if ( $('div#seiling' + this.index + ' input.falsework:checked').val()==2 ) {
			this.textureSum =  this.textureSum + this.textureSum * ( options.falsework_3_5 / 100 );
			this.optionsSum =  this.optionsSum + this.optionsSum * ( options.falsework_3_5 / 100 );
		}
		if ( $('div#seiling' + this.index + ' input.falsework:checked').val()==3 ) {
			this.textureSum =  this.textureSum + this.textureSum * ( options.falsework_5_7 / 100 );
			this.optionsSum =  this.optionsSum + this.optionsSum * ( options.falsework_5_7 / 100 );
		}

		calculate();
		
	}
	this.setTabTitle();
	
}

// Отновление текстуры данными (Ткань)

TexSeiling.prototype.updateTexture = function() {
	var oldValue = $('select[name="tex-texture'+this.index+'"]').val();

	var area = float( $('div#seiling' + this.index + ' .cut-area').text() );

	$('select[name="tex-texture'+this.index+'"]').html('');
	$('select[name="tex-texture'+this.index+'"]').append('<option value="0">Nije izabrano</option>');
	
	var i;
	for (i = 0; i < texTexture.length; ++i) {
		var s = '<option value="'+ texTexture[i].id +'">'+ texTexture[i].title;
		s = s + ' ' + texTexture[i].w1 + '/' + texTexture[i].w2 + '/' + texTexture[i].w3;
		if ( !(isNaN(area) ) && area > 0 ) {
			switch( true ) {
				case (area < 5):
					s = s + '; 1 m²: ' + numberWithCommas(texTexture[i].a0) + ' €, ukupno: ' + numberWithCommas(texTexture[i].a0 * area) + ' €';
					break;
				case (area < 10):
					s = s + '; 1 m²: ' + numberWithCommas(texTexture[i].a5) + ' €, ukupno: ' + numberWithCommas(texTexture[i].a5 * area) + ' €';
					break;
				case (area < 21):
					s = s + '; 1 m²: ' + numberWithCommas(texTexture[i].a10) + ' €, ukupno: ' + numberWithCommas( texTexture[i].a10 * area) + ' €';
					break;
				default:
					s = s + '; 1 m²: ' + numberWithCommas(texTexture[i].a21) + ' €, ukupno: ' + numberWithCommas( texTexture[i].a21 * area) + ' €';
			}
		}
		
		s = s + '</option>';
		
		$('select[name="tex-texture'+this.index+'"]').append(s);
		
	}
	
	$('select[name="tex-texture'+this.index+'"] option[value="' + oldValue + '"]').prop('selected', true);
}



TexSeiling.prototype.check = function() {
	var noError = this.commonCheck();

	// Макс. длина Ткань
	var length = $('div#seiling' + this.index + ' input[name*="tex-length' + this.index + '"]').val();
	if ( isNaN(float(length)) || float(length) <= 0 ) {
		$('div#seiling' + this.index + ' div.length').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.length').removeClass('has-error');
	}

	// Макс. ширина Ткань
	var width = $('div#seiling' + this.index + ' input[name*="tex-width' + this.index + '"]').val();
	if ( isNaN(float(width)) || float(width) <= 0 ) {
		$('div#seiling' + this.index + ' div.width').addClass('has-error');
		noError = false;
	}
	else {
		$('div#seiling' + this.index + ' div.width').removeClass('has-error');
	}
	
	// периметр Ткань
	
	var div = $('div#seiling' + this.index + ' input[name*="perimeter' + this.index + '"]').val();
	var noPerimeterError = true;
	if ( div ) {
		if ( div.length > 0 && float(div) == '' ) {
			noPerimeterError = false;
		};
		
		if (noPerimeterError) {
			$('div#seiling' + this.index + ' div.perimeter').removeClass('has-error');
		}
		else {
			$('div#seiling' + this.index + ' div.perimeter').addClass('has-error');
			noError = false;
		}
	}
	
	// Не потолок не реализуем (если оба измерения больше ширины отреза)
	
	if (
		!( isNaN(float(length)) || float(length) <= 0)
		&&
		!( isNaN(float(width)) || float(width) <= 0 )
		&&
		$('select[name="tex-texture'+this.index+'"]').val() > 0
		) {
			length = float(length) + 0.20;
			width = float(width) + 0.20;

			var w3;

			var i;
			for (i = 0; i < texTexture.length; ++i) {
				if ( texTexture[i].id == $('select[name="tex-texture'+this.index+'"]').val() ) {
					w3=texTexture[i].w3 / 100;
				}
			}
			w3=w3.toFixed(2);

			if (length > w3 && width > w3) {
				$('div#seiling' + this.index + ' .tex-calc-error').slideDown();
				$('div#seiling' + this.index + ' .tex-calc').hide();
				$('div#seiling' + this.index + ' .main-alert-info').hide();
		 
				this.setTabTitle();

				noError = false;
				$('div#seiling' + this.index + ' div.length').addClass('has-error');
				$('div#seiling' + this.index + ' div.width').addClass('has-error');
				$('div#seiling' + this.index + ' div.texture').addClass('has-error');


			}
			else {
				$('div#seiling' + this.index + ' .tex-calc-error').slideUp();

				$('div#seiling' + this.index + ' div.texture').removeClass('has-error');
			}

			
		}
	
	if (noError) {
		this.hideError();
	}
	else {
		this.showError();
		this.flush();
		sortSeilings();
	}
	return noError;
}

// Вычисление стоимости (Ткань)

TexSeiling.prototype.calculate = function() {
	if ( this.check() ) {
		

		var realLength = parseFloat(float( $('input[name="tex-length'+this.index+'"]').val() ));
		var realWidth = parseFloat(float( $('input[name="tex-width'+this.index+'"]').val() ));
		
		var length = parseFloat(parseFloat(realLength) + 0.20);
		var width = parseFloat(parseFloat(realWidth) + 0.20);
		length = length.toFixed(2);
		width = width.toFixed(2);

		$('div#seiling' + this.index + ' .length-margin').text(length);
		$('div#seiling' + this.index + ' .width-margin').text(width);

		// Получаем ширины выбранного полотна

		var w1, w2, w3;

		var i;
		for (i = 0; i < texTexture.length; ++i) {
			if ( texTexture[i].id == $('select[name="tex-texture'+this.index+'"]').val() ) {
				w1=texTexture[i].w1 / 100;
				w2=texTexture[i].w2 / 100;
				w3=texTexture[i].w3 / 100;
			}
		}
		w1=w1.toFixed(2);
		w2=w2.toFixed(2);
		w3=w3.toFixed(2);

		// Если потолок не реализуем
		
		if (length > w3 && width > w3) {
			$('div#seiling' + this.index + ' .tex-calc-error').slideDown();
			$('div#seiling' + this.index + ' .tex-calc').hide();
			$('div#seiling' + this.index + ' .main-alert-info').hide();
			 
			this.setTabTitle();
			return;
		}
		else {
			$('div#seiling' + this.index + ' .tex-calc-error').slideUp();
		}

		// Определяем меньшее измерение и большее измерение
		
		var maxDim = length > width ? length : width;
		var minDim = length > width ? width : length;

// (1) Сначала пытаемся разместить отрез в портретной ориентации (точно разместится!)

		// Пытаемся меньшее измерение уложить по очереди в ширину рулонов

		var widthPortrait = 0; // ширина выбранного рулона
		var texWidthPortrait = 0; // ширина отреза
		var texLengthPortrait = 0; // Длина отреза

		if (minDim <= w1 && texWidthPortrait==0) { widthPortrait = w1; texWidthPortrait = minDim; texLengthPortrait = maxDim; }
		if (minDim <= w2 && texWidthPortrait==0) { widthPortrait = w2; texWidthPortrait = minDim; texLengthPortrait = maxDim; }
		if (minDim <= w3 && texWidthPortrait==0) { widthPortrait = w3; texWidthPortrait = minDim; texLengthPortrait = maxDim; }

		// считаем, что придётся выкинуть
		var portraitLoseArea = ( widthPortrait - texWidthPortrait ) * texLengthPortrait;
		
//		console.log('widthPortrait: '+widthPortrait+', texWidthPortrait:'+texWidthPortrait+', texLengthPortrait:'+texLengthPortrait+', portraitLoseArea:'+portraitLoseArea);

// (2) Теперь пытаемся разместить отрез в альбомной ориентации (может не разместиться)
// Если не разместился, используем для него данные от портретной ориентации

		// Пытаемся большее измерение уложить по очереди в ширину рулонов

		var widthLandscape = 0; // ширина выбранного рулона
		var texWidthLandscape = 0; // ширина отреза
		var texLengthLandscape = 0; // Длина отреза

		if (maxDim <= w1 && texWidthLandscape==0) { widthLandscape = w1; texWidthLandscape = maxDim; texLengthLandscape = minDim; }
		if (maxDim <= w2 && texWidthLandscape==0) { widthLandscape = w2; texWidthLandscape = maxDim; texLengthLandscape = minDim; }
		if (maxDim <= w3 && texWidthLandscape==0) { widthLandscape = w3; texWidthLandscape = maxDim; texLengthLandscape = minDim; }

//		console.log('(*) widthLandscape: '+widthLandscape+', texWidthLandscape:'+texWidthLandscape+', texLengthLandscape:'+texLengthLandscape);

		// если не получилось, берём все значения из портретной ориентации
		if (texWidthLandscape==0) {
			widthLandscape = widthPortrait;
			texWidthLandscape = texWidthPortrait;
			texLengthLandscape = texLengthPortrait;
		}
		// считаем, что придётся выкинуть
		var landscapeLoseArea = ( widthLandscape - texWidthLandscape ) * texLengthLandscape;

//		console.log('widthLandscape: '+widthLandscape+', texWidthLandscape:'+texWidthLandscape+', texLengthLandscape:'+texLengthLandscape+', landscapeLoseArea:'+landscapeLoseArea);

// (3) Опеределяем, какая ориентация экономнее (для клиента) - в каком случае выкинутая площадь окажется меньше
		
		var texWidth = 0;
		var texLength = 0;
		
		if (portraitLoseArea > landscapeLoseArea) {
			// располагаем в альбомной ориентации

			if (texLengthLandscape == length) {
				$('div#seiling' + this.index + ' .length-cut').html('(dužina reza)');
				$('div#seiling' + this.index + ' .width-cut').html('&nbsp;');
			}
			else {
				$('div#seiling' + this.index + ' .length-cut').html('&nbsp;');
				$('div#seiling' + this.index + ' .width-cut').html('(dužina reza)');
			}

			texWidth = widthLandscape;
			texLength = texLengthLandscape;

		}
		else {
			// располагаем в портретной ориентации

			if (texLengthPortrait == length) {
				$('div#seiling' + this.index + ' .length-cut').html('(dužina reza)');
				$('div#seiling' + this.index + ' .width-cut').html('&nbsp;');
			}
			else {
				$('div#seiling' + this.index + ' .length-cut').html('&nbsp;');
				$('div#seiling' + this.index + ' .width-cut').html('(dužina reza)');
			}
			
			texWidth = widthPortrait;
			texLength = texLengthPortrait;
			
		}
		
		

		// Выводим ширину рулона, указываем длину отреза, считаем и выводим площадь отреза

		$('div#seiling' + this.index + ' .tex-width').html( texWidth );

		var area = texWidth*texLength;
		area = area.toFixed(2);
		
		$('div#seiling' + this.index + ' .cut-area').html( area );

		// Разбираемся с периметрами
		var calcPerimeter = ( parseFloat(realWidth) + parseFloat(realLength) ) * 2;
		calcPerimeter = calcPerimeter.toFixed(2);
		$('div#seiling' + this.index + ' .calc-perimeter').html( calcPerimeter );
		var perimeter;
		
		var div = $('div#seiling' + this.index + ' input[name*="perimeter' + this.index + '"]').val();
		if ( div ) {
			if ( float(div) > 0 ) {
				perimeter = parseFloat(float( div ));
			}
		
		}
		
		if (perimeter > 0) {
			perimeter = perimeter.toFixed(2);
			$('div#seiling' + this.index + ' .real-perimeter').html( perimeter );
		}
		else {
			perimeter = calcPerimeter;
			$('div#seiling' + this.index + ' .real-perimeter').html( calcPerimeter );
		}
		
		// Выводим плашку с вычислениями
		
		$('div#seiling' + this.index + ' .tex-calc').slideDown();

		this.updateTexture();

		var texture;
		var i;
		for (i = 0; i < texTexture.length; ++i) {
			if ( texTexture[i].id == $('select[name="tex-texture'+this.index+'"]').val() ) {
				switch( true ) {
					case (area < 5):
						texture = texTexture[i].a0;
						break;
					case (area < 10):
						texture = texTexture[i].a5;
						break;                           
					case (area < 21):                    
						texture = texTexture[i].a10;
						break;                           
					default:                             
						texture = texTexture[i].a21;
				}
			}
		}

		this.textureSum = area * texture;

		this.optionsSum =  Math.ceil(perimeter) * options.texPerimeter;

		// Обход трубы / Углы / Люстра / Монтаж свет-ка
		div = $('div#seiling' + this.index + ' input[name*="bypassing-tube' + this.index + '"]').val();

		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.bypassingTube;
		}

		div = $('div#seiling' + this.index + ' input[name*="corners' + this.index + '"]').val();
		if ( (integer(div) > 0) && (integer(div) <= 4) ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.corner;
		}
		if ( integer(div) > 4 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.corner4;
		}

		div = $('div#seiling' + this.index + ' input[name*="chandelier' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.chandelier;
		}

		div = $('div#seiling' + this.index + ' input[name*="luminaire' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.luminaire;
		}

		var lamp = $('div#seiling' + this.index + ' input[name*="lamp' + this.index + '"]').val();
		if ( !isNaN(float(lamp)) && float(lamp) > 0 ) {
			this.optionsSum = this.optionsSum + float(lamp) * parseInt( $('div#seiling' + this.index + ' select[name*="light-type' + this.index + '"] option:selected').attr('data-price') );
			this.optionsSum = this.optionsSum + float(lamp) * parseInt( $('div#seiling' + this.index + ' select[name*="light-bulb' + this.index + '"] option:selected').attr('data-price') );
		}
		
		
	// Дополнительные параметры

		// Керамогранит
		div = $('div#seiling' + this.index + ' input[name*="keramogranit' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.keramogranit;
		}
		// Закарнизное пространство
		div = $('div#seiling' + this.index + ' input[name*="soffit-space' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.soffitSpace;
		}
		// Брус
		div = $('div#seiling' + this.index + ' input[name*="timber' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.timber;
		}
		// Установка светодиодной ленты
		div = $('div#seiling' + this.index + ' input[name*="led-strip' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.ledStrip;
		}
		// Криволинейность
		div = $('div#seiling' + this.index + ' input[name*="curvilinearity' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.curvilinearity;
		}
		// Внутренний вырез
		div = $('div#seiling' + this.index + ' input[name*="inner-cut' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.innerCut;
		}
		// Отверстие под вентиляцию
		div = $('div#seiling' + this.index + ' input[name*="ventilation' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.ventilation;
		}
		// Монтаж вытяжки
		div = $('div#seiling' + this.index + ' input[name*="air-vent' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.airVent;
		}
		// Потол. карниз (точка крепления)
		div = $('div#seiling' + this.index + ' input[name*="ceiling-cornice' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.ceilingCornice;
		}
		// Установка трансформатора, констроллера
		div = $('div#seiling' + this.index + ' input[name*="transformer' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.transformer;
		}
		// Установка датчика
		div = $('div#seiling' + this.index + ' input[name*="sensor' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.sensor;
		}
		// Разделитель
		div = $('div#seiling' + this.index + ' input[name*="separator' + this.index + '"]').val();
		if ( integer(div) > 0 ) {
			this.optionsSum =  this.optionsSum + integer(div) * options.separator;
		}
		
		// Потолочный багет
		
		// Арт-печать
		
		// Центровка шва
		
		
		
		if ( $('div#seiling' + this.index + ' input.falsework:checked').val()==2 ) {
			this.textureSum =  this.textureSum + this.textureSum * ( options.falsework_3_5 / 100 );
			this.optionsSum =  this.optionsSum + this.optionsSum * ( options.falsework_3_5 / 100 );
		}
		if ( $('div#seiling' + this.index + ' input.falsework:checked').val()==3 ) {
			this.textureSum =  this.textureSum + this.textureSum * ( options.falsework_5_7 / 100 );
			this.optionsSum =  this.optionsSum + this.optionsSum * ( options.falsework_5_7 / 100 );
		}
		
		calculate();
	}
	this.setTabTitle();
	
}

// Создание потолков при нажатии на кнопки

$('.seiling_add_pvc').click(function(){
	new PVCSeiling();
});

$('.seiling_add_tex').click(function(){
	new TexSeiling();
});

$('select[name=company]').change(function(){
	updateLampLight();
});


// Подтверждение удаления потолка

$(document).on("click", ".btn-delete-confirm",function(){
	$(this).closest('.row').next('.row').slideToggle();
});

// Удаление потолка

$(document).on("click", ".btn-delete",function(){
	seilingList[ seilingByName($(this).attr('name')) ].delete();
});

// Сообщение о лесах заказчика

$(document).on("change", "input.falsework",function(){
	if ( $(this).val() == 1 ) {
		$(this).parent('label').nextAll('span.falsework').fadeOut();
	}
	else {
		$(this).parent('label').nextAll('span.falsework').fadeIn();
	}
});

// Показываем/скрываем поле для количества светильников

$(document).on("change", "select.ceiling-light-type",function(){
	if ( $(this).val() == 0 ) {
		$(this).parent('div').siblings('.light-count').fadeOut();
	}
	else {
		$(this).parent('div').siblings('.light-count').fadeIn();
		equalizeAddOn();
	}
});

// Переименовывем (вкладку)

$(document).on("click keyup keydown keypres select change", "input.ceiling-name",function(){
	seilingList[ seilingByName($(this).attr('name')) ].title = $(this).val();
	seilingList[ seilingByName($(this).attr('name')) ].setTabTitle();
});

// Проверка (и пересчёт) после обновления полей

$(document).on("click keyup keydown keypres select change", '.tab-content select,.tab-content input',function(){
	seilingList[ seilingByName($(this).attr('name')) ].updateTexture();
	seilingList[ seilingByName($(this).attr('name')) ].calculate();
});

$(document).on("click keyup keydown keypres select change", 'input[name^="discount"]',function(){
	calculate();
});



// Показывание/сокрытие дополнительных парметров

$(document).on("click", ".btn-extra-parameters",function(){
	$(this).parents('.tab-pane').children('.extra-parameters').slideToggle();
	equalizeAddOn();
});

$(function(){
	// Инициализируем popover'ы
	initPopovers();

	// Сообщение о лесах заказчика

	$('select[name="company"]').change(function(){
		
		$('.start-help').fadeOut();
		
		// Если есть пустой элемент - удаляем его
		// (раньше выбор компании был через радиобаттоны; чтобы не переделывать логику, когда выберут пустую компанию)
		if ( $(this).val() != '' ) {
			$('select[name="company"] option[value=""]').remove();
		}
		
		
		// Показываем скрываем дилера
		if ( $(this).val() == 'dealer' ) {
			$('.dealer').fadeIn();
		}
		else {
			$('.dealer').fadeOut();
		}
	});
});

