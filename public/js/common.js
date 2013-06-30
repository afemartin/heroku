$(function() {

	// Binding events
	/////////////////////////////////////

	$('#create-film-form').submit(function(e) {
		e.preventDefault();
		var filmData = $(this).serialize();
		createFilm(filmData);
	});

	$('.js-film-delete').click(function(e) {
		e.preventDefault();
		var filmId = {
			'id': $(this).attr('data-film-id')
		};
		deleteFilm(filmId);
	});

	$('#search-film-form').submit(function(e) {
		e.preventDefault();
		var filmData = $(this).serialize();
		searchFilm(filmData);
	});

	// Public functions
	/////////////////////////////////////

	function createFilm(filmData) {
		$.post("/film/create.json", filmData, createFilmSuccessCallback, "json");
	}

	function createFilmSuccessCallback(response) {
		if (response.success) {
			location.reload();
		}
	}

	function deleteFilm(filmId) {
		$.post("/film/delete.json", filmId, deleteFilmSuccessCallback, "json");
	}

	function deleteFilmSuccessCallback(response) {
		if (response.success) {
			location.reload();
		}
	}

	function searchFilm(filmData) {
		$.post("/film/search.json", filmData, searchFilmSuccessCallback, "json");
		if ($('#search-film-form + .well').length > 0) {
			$('#search-film-form + .well').remove();
		}
	}

	function searchFilmSuccessCallback(response) {
		if (response.success && response.data) {
			$('#search-film-form').after($('<div></div>').addClass('well').text(response.data));
		}
	}

});