(function ($) {
    $.fn.connect4 = function (settings) {

        let game_status = 0;
        let default_values = {
            'rows': 7,
            'columns': 7,
            'player1': "Player 1",
            'player2': "Player 2",
            'p1_color': 'gold',
            'p2_color': 'lightpink'
        };
        let attr_params = $.extend(default_values, settings);
        let id_player = 1;

        function initInterface() {
            $("#settings").html("<h1>Puissance4</h1>"
                + "<br><input id='player1' type='text' placeholder='Player1'/>"
                + "<br><input id='player2' type='text' placeholder='Player2'/>"
                + "<br><input id='p1_color' type='text' placeholder='Color1'/>"
                + "<br><input id='p2_color' type='text' placeholder='Color2'/>"
                + "<br><input id='columns' type='number' placeholder='Columns' />"
                + "<br><input id='rows' type='number' placeholder='Rows'/>"
                + "<br><input id='play' type='submit' value='Play' />"
                + "<br><input id='replay' type='submit' value='New Match' />"
                + "<br><input id='undo' type='submit' value='Undo' />"
            );
        }

        function error(dialog) {
            $("body").append(dialog);
            $(dialog).dialog();
        }

        function initValues(object1, object2) {
            $(object1).val("");
            $(object2).val("");
        }

        function fetchName(player_tag, p_initial, gamer) {
            if ($(player_tag).val().length > 0) {
                p_initial = $(player_tag).val()[0];
                attr_params.gamer = $(player_tag).val();
            }
        }

        function fetchColor(player_tag, p_color, gamer) {
            if ($(player_tag).val().length > 0) {
                p_color = $(player_tag).val();
                attr_params.gamer = $(player_tag).val();
            }
        }


        function initCheck(flag = 0) {
            let player1 = $("#player1").val();
            let player2 = $("#player2").val();
            let rows = $("#rows").val();
            let columns = $("#columns").val();
            let p1_initial = attr_params.player1[7];
            let p2_initial = attr_params.player2[7];
            let p1_color = $("#p1_color").val();
            let p2_color = $("#p2_color").val();

            if ($("#player1").val().length > 0 && $("#player2").val().length > 0) {
                if ($("#player1").val() === $("#player2").val()) {
                    const dialog = $("<div title='Warning'>Change user-name</div>");
                    error(dialog);
                    initValues("#player1", "#player2");
                    game_status = 0;
                    return false;
                }
            }
            if ($("#player1").val().length === 0 && $("#player2").val().length === 0) {
                player1 = default_values["player1"];
                player2 = default_values["player2"];
            }

            fetchName("#player1", p1_initial, player1);
            fetchName("#player2", p2_initial, player2);

            if ($("#p1_color").val().length > 0 && $("#p2_color").val().length > 0) {
                if ($("#p1_color").val() === $("#p2_color").val()) {
                    const dialog = $("<div title='Warning'>Change colors</div>");
                    error(dialog);
                    initValues("#p1_color", "#p2_color");
                    game_status = 0;
                    return false;
                }
            }
            if ($("#p1_color").val().length === 0 && $("#p2_color").val().length === 0) {
                p1_color = default_values["p1_color"];
                p2_color = default_values["p2_color"];
            }

            fetchColor("#player1", p1_color, player1);
            fetchColor("#player2", p2_color, player2);


            if ((rows > 7 && columns > 9) || (attr_params.rows > 7 && attr_params.columns > 9)) {
                const dialog = $("<div title='Warning'>Max 7 rows and 9 columns</div>");
                error(dialog);
                initValues("#rows", "#columns");
                game_status = 0;
                return false;

            } else if (rows > 7 || attr_params.rows > 7) {
                const dialog = $("<div title='Warning'>Max 7 rows</div>");
                error(dialog);
                initValues("#rows");
                game_status = 0;
                return false;

            } else if (columns > 9 || attr_params.columns > 9) {
                const dialog = $("<div title='Warning'>Max 9 columns</div>");
                error(dialog);
                initValues("#columns");
                game_status = 0;
                return false;
            }
            if (flag === 0)
                initGame(rows, columns);
            else if (flag === 1)
                return ([p1_initial, p2_initial, p1_color, p2_color, player1, player2]);
            return true;
        }

        function createGrid() {
            $("<table id='game' cellspacing='7'>").insertAfter("#settings");
            let rows = attr_params.rows;
            for (let i = 1; i <= rows; rows--) {
                let tr = $("<tr data-rows=" + rows + " id=rows-" + rows + ">").css("background", "lightsteelblue");
                let tab = $("#game").append(tr).css("background", "lightsteelblue");

                for (let j = 1; j <= attr_params.columns; j++) {
                    $("#rows-" + rows).append("<td id=columns-" + rows + "-" + j + " data-state=false data-player=>");
                }
            }
            $("<p id=turn>").insertAfter("#game");
        }

        function initGame(rows, columns) {
            if (rows > 0 && columns > 0) {
                if (rows >= 6 && columns >= 6) {
                    attr_params.rows = rows;
                    attr_params.columns = columns;

                } else {
                    const dialog = $("<div title='Warning'>Game too small</div>");
                    error(dialog);
                    return false;
                }
            }
            createGrid();
        }

        function rowWin(id_player, columns, index) {
            if (id_player === 1) {
                attr_params.player = attr_params.player1;
            } else if (id_player === 2) {
                attr_params.player = attr_params.player2;
            }
            let win = 0;
            for (let y = 1; y <= columns; y++) {
                if ($("#columns-" + index + "-" + y).data("player") === id_player) {
                    win++;
                    if (win === 4) {
                        const dialog = $("<div title='Warning'>" + attr_params.player + "a gagne!</div>");
                        error(dialog);
                        return true;
                    }
                } else {
                    win = 0;
                }
            }
        }

        function columnWin(id_player, rows, index) {
            if (id_player === 1) {
                attr_params.player = attr_params.player1;
            } else if (id_player === 2) {
                attr_params.player = attr_params.player2;
            }
            let win = 0;
            for (let x = 1; x <= rows; x++) {
                if ($("#columns-" + x + "-" + index).data("player") === id_player) {
                    win++;
                    if (win === 4) {
                        const dialog = $("<div title='Warning'>" + attr_params.player + " a gagne!</div>");
                        error(dialog);
                        return true;
                    }
                } else {
                    win = 0;
                }
            }
        }

        function diagonalAWin(id_player, index, index_col2) {
            if (id_player === 1) {
                attr_params.player = attr_params.player1;
            } else if (id_player === 2) {
                attr_params.player = attr_params.player2;
            }
            let win = 0;
            let row_start = parseInt(index_col2) - 4;
            let row_end = parseInt(index_col2) + 3;
            let column_counter = index + 3;
            while (row_start++ <= row_end && win < 4) {
                let elem = ($("#columns-" + (column_counter--) + "-" + (row_start))[0]);
                if (elem !== undefined) {
                    if ($(elem).data("player") === id_player)
                        win++;
                    else
                        win = 0;
                }
            }
            if (win === 4) {
                const dialog = $("<div title='Warning'>" + attr_params.player + "a gagne!</div>");
                error(dialog);
                return true;
            } else {
                return false;

            }
        }

        function diagonalBWin(id_player, index, index_col2) {
            if (id_player === 1) {
                attr_params.player = attr_params.player1;
            } else if (id_player === 2) {
                attr_params.player = attr_params.player2;
            }
            let win = 0;
            let row_start = parseInt(index_col2) - 4;
            let row_end = parseInt(index_col2) + 3;
            let column_counter = index - 3;
            while (row_start++ <= row_end && win < 4) {
                let elem = ($("#columns-" + (column_counter++) + "-" + (row_start))[0]);
                if (elem !== undefined) {
                    if ($(elem).data("player") === id_player)
                        win++;
                    else
                        win = 0;
                }
            }
            if (win === 4) {
                const dialog = $("<div title='Warning'>" + attr_params.player + "a gagne!</div>");
                error(dialog);
                return true;
            } else
                return (false);
        }

        function clickPosition(td) {
            let col = $(td).attr("id");
            let index_col = col.split("-");
            index_col = index_col[1] + "-" + index_col[2];
            let index_col2 = index_col[2];
            dropToken(index_col2, attr_params.rows, attr_params.columns);
        }

        function dropToken(index_col2, rows, columns) {
            // debugger
            for (let index = 1; index <= attr_params.rows; index++) {
                let td_player = $("#" + "columns-" + index + "-" + index_col2);
                let state_player = $("#" + "columns-" + index + "-" + index_col2);
                if (state_player.data("state") === false) {
                    let tab = initCheck(1);
                    if (id_player === 1) {
                        $(td_player).data(
                            {
                                "state": true,
                                "player": id_player
                            }).html(tab[0]).css("background", tab[2]);
                    } else if (id_player === 2) {
                        $(td_player).data({
                            "state": true,
                            "player": id_player
                        }).html(tab[1]).css("background", tab[3]);
                    }

                    let player_name = attr_params[`player${id_player}`];
                    if (rowWin(id_player, columns, index) || columnWin(id_player, rows, index_col2)
                        || diagonalAWin(id_player, index, index_col2) || diagonalBWin(id_player, index, index_col2)) {
                        $("#turn").html(player_name + " is the winner").css({"color": attr_params[`p${id_player}_color`]});

                        id_player = 0;
                        break;
                    }
                    id_player = id_player === 1 ? 2 : 1;
                    $("#turn").html(player_name + " 's turn").css(
                        {
                            "color": default_values[`p${id_player}_color`]
                        });
                    break;
                }
            }

        }

        initInterface();

        $("#play").click(function () {
            if (game_status === 0) {
                game_status = 1;
                initCheck();

                $("td").click(function () {
                    let td = this;
                    clickPosition(td);
                })
            }
        });

        $("#replay").click(function () {
            location.reload();
        });

        $("#undo").click(function () {
            //TODO

        });

    }
})
(jQuery);
$("#settings").connect4();
