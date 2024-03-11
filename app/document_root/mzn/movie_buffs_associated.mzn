include "globals.mzn";

% Based on https://www.ahapuzzles.com/logic/logic-puzzles/movie-buffs-associated-al-pacino

function int: time(0..23: hours, 0..59: minutes) = hours * 60 + minutes;
function var int: hours(var int: time) = time div 60;
function var int: minutes(var int: time) = time mod 60;

% Static data
int: releases = 5;
set of int: releases_indexes = 1..releases;
enum film_names = {Scarface, Scarecrow, Donnie_Brasco, F_88_Minutes, The_Recruit};
array[releases_indexes] of film_names: film_name_values = [Scarface, Scarecrow, Donnie_Brasco, F_88_Minutes, The_Recruit];
array[releases_indexes] of int: film_date_values = [1983, 1973, 1997, 2007, 2003];
enum day_names = {Monday, Tuesday, Wednesday, Thursday, Friday};
array[releases_indexes] of day_names: day_name_values = [Monday, Tuesday, Wednesday, Thursday, Friday];
array[releases_indexes] of 1..7: day_position_values = 1..releases;
array[releases_indexes] of int: time_values = [time(19, 35), time(19, 40), time(20, 20), time(20, 30), time(20, 45)];
enum name_values = {Jessica_Farmer, Laurie_Davison, Mark_Thomson, Mary_Peters, Sally_Boyden};
set of name_values: men_names = {Mark_Thomson, Laurie_Davison};
set of name_values: women_names = {Sally_Boyden, Jessica_Farmer, Mary_Peters};

% Decision variables
array[releases_indexes] of var releases_indexes: film_indexes;
array[releases_indexes] of var releases_indexes: day_indexes;
array[releases_indexes] of var releases_indexes: time_indexes;
array[releases_indexes] of var name_values: name_releases;

% From this information and the following clues, for each member, can you determine who chose which film, the day on which it was shown, and at what time?
constraint alldifferent(film_indexes);
constraint day_indexes = 1..releases;
constraint alldifferent(time_indexes);
constraint alldifferent(name_releases);

% 1. Of the 20-hundreds releases, neither of which was Jessica's choice, one opened the week and one closed the week.
constraint forall(release_index_1 in releases_indexes where film_date_values[film_indexes[release_index_1]] >= 2000)
(
	name_releases[release_index_1] != Jessica_Farmer
);
constraint exists(release_index_1 in releases_indexes, release_index_2 in releases_indexes where release_index_1 != release_index_2)
(
	film_date_values[film_indexes[release_index_1]] >= 2000
	/\ day_position_values[day_indexes[release_index_1]] = 1
	/\ film_date_values[film_indexes[release_index_2]] >= 2000
	/\ day_position_values[day_indexes[release_index_2]] = releases
);

% 2. The latest of the 19-hundreds releases was shown at 30 minutes past the hour.
constraint exists(release_index_1 in releases_indexes)
(
	film_date_values[film_indexes[release_index_1]] < 2000
	/\ minutes(time_values[time_indexes[release_index_1]]) = 30
	/\ forall(release_index_2 in releases_indexes where release_index_1 != release_index_2 /\ film_date_values[film_indexes[release_index_2]] < 2000)
	(
		film_date_values[film_indexes[release_index_1]] > film_date_values[film_indexes[release_index_2]]
	)
);

% 3. The releases shown before 8:00 pm were on consecutive days, as were the releases shown after 8:00 pm.
int: time_8pm = time(20, 0);
predicate consecutive_before_8pm(releases_indexes: release_index_min, releases_indexes: release_index_max) =
	release_index_max = release_index_min + 1
	\/ 
	(
	  time_values[time_indexes[release_index_min + 1]] < time_8pm
	  /\ consecutive_before_8pm(release_index_min + 1, release_index_max)
	)
;
constraint forall
(
	release_index_1 in releases_indexes, release_index_2 in releases_indexes 
	where
		release_index_1 < release_index_2
		/\ time_values[time_indexes[release_index_1]] < time_8pm
		/\ time_values[time_indexes[release_index_2]] < time_8pm
)
(
	consecutive_before_8pm(release_index_1, release_index_2)
);
predicate consecutive_after_8pm(releases_indexes: release_index_min, releases_indexes: release_index_max) =
	release_index_max = release_index_min + 1
	\/ 
	(
	  time_values[time_indexes[release_index_min + 1]] > time_8pm
	  /\ consecutive_after_8pm(release_index_min + 1, release_index_max)
	)
;
constraint forall
(
	release_index_1 in releases_indexes, release_index_2 in releases_indexes 
	where
		release_index_1 < release_index_2
		/\ time_values[time_indexes[release_index_1]] > time_8pm
		/\ time_values[time_indexes[release_index_2]] > time_8pm
)
(
	consecutive_after_8pm(release_index_1, release_index_2)
);

% 4. One of the men and one of the women had a showing before 8:00 pm, but neither was mid-week.
constraint exists(release_index_1 in releases_indexes)
(
	member(men_names, name_releases[release_index_1])
	/\ time_values[time_indexes[release_index_1]] < time_8pm
	/\ day_position_values[day_indexes[release_index_1]] != 3
);
constraint exists(release_index_1 in releases_indexes)
(
	member(women_names, name_releases[release_index_1])
	/\ time_values[time_indexes[release_index_1]] < time_8pm
	/\ day_position_values[day_indexes[release_index_1]] != 3
);

% 5. Mark, whose choice was Scarecrow, had a showing at a time of one hour and five minutes after that of Scarface.
int: time_1h05 = time(1, 5);
constraint exists(release_index_1 in releases_indexes, release_index_2 in releases_indexes)
(
	name_releases[release_index_1] = Mark_Thomson
	/\ film_name_values[film_indexes[release_index_1]] = Scarecrow
	/\ film_name_values[film_indexes[release_index_2]] = Scarface
	/\ time_values[time_indexes[release_index_1]] = time_values[time_indexes[release_index_2]] + time_1h05 
);

% 6. Neither Miss Farmer nor Miss Peters had a showing on an even-numbered day
constraint exists(release_index_1 in releases_indexes, release_index_2 in releases_indexes)
(
	name_releases[release_index_1] = Jessica_Farmer
	/\ day_position_values[day_indexes[release_index_1]] mod 2 = 1
	/\ name_releases[release_index_2] = Mary_Peters
	/\ day_position_values[day_indexes[release_index_2]] mod 2 = 1
);

% 7. 88 Minutes showed at a time both 40 minutes to the hour and 40 minutes after the Thursday showing.
constraint exists(release_index_1 in releases_indexes, release_index_2 in releases_indexes)
(
	film_name_values[film_indexes[release_index_1]] = F_88_Minutes
	/\ member([20, 40], minutes(time_values[time_indexes[release_index_1]]))
	/\ day_name_values[day_indexes[release_index_2]] = Thursday
	/\ time_values[time_indexes[release_index_1]] = time_values[time_indexes[release_index_2]] + 40
);

function string: format_time(var int: time) = "\(hours(time))h\(minutes(time))";
output 
[
	"\(day_name_values[i]): \(name_releases[i]) for \(film_name_values[film_indexes[i]]) (\(film_date_values[film_indexes[i]]))"
	++ " at \(format_time(time_values[time_indexes[i]]))\n" | i in releases_indexes
];