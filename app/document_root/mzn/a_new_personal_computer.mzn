include "globals.mzn";

% Based on https://www.ahapuzzles.com/logic/logic-puzzles/a-new-personal-computer

% Static data
int: computers = 5;
set of int: computer_indexes = 1..computers;
array[computer_indexes] of int: processor_values = [20, 23, 25, 27, 31];
array[computer_indexes] of int: hard_disk_values = [250, 320, 500, 750, 1024];
array[computer_indexes] of int: price_values = [699, 999, 1149, 1349, 1649];
array[computer_indexes] of int: monitor_values = [130, 150, 156, 215, 270];

% Decision variables
array[computer_indexes] of var computer_indexes: processor_indexes;
array[computer_indexes] of var computer_indexes: hard_disk_indexes;
array[computer_indexes] of var computer_indexes: price_indexes;
array[computer_indexes] of var computer_indexes: monitor_indexes;
var computer_indexes: andrew_computer_index;

% Each computer has a different screen size, processor power, hard drive capacity and price
constraint processor_indexes = 1..computers;
constraint alldifferent(hard_disk_indexes);
constraint alldifferent(price_indexes);
constraint alldifferent(monitor_indexes);

% 1. Andrew bought the computer which was three hundred Euros less 
% than the PC which has a processor that is 0.4 MHz more powerful than the one which has a 21.5' screen.
constraint exists(computer_index_1 in computer_indexes, computer_index_2 in computer_indexes)
(
	price_values[price_indexes[andrew_computer_index]] = price_values[price_indexes[computer_index_1]] - 300
	/\ processor_values[processor_indexes[computer_index_1]] = processor_values[processor_indexes[computer_index_2]] + 4
	/\ monitor_values[monitor_indexes[computer_index_2]] = 215
);

% 2. The five computers are: 
% - the one chosen by Andrew (which doesn't have the 27' screen)
% - the one which has the 2.0-MHz processor
% - the computer that has a 250 GB HD
% - the one which has a price of 1,149 Euros
% - the computer (which doesn't have the 15' screen) that has the HD bigger than the one chosen by Andrew 
% but smaller than that the one which has the 2.7 MHz processor.
constraint exists
(
	computer_index_1 in computer_indexes, 
	computer_index_2 in computer_indexes, 
	computer_index_3 in computer_indexes, 
	computer_index_4 in computer_indexes,
	computer_index_5 in computer_indexes
)
(
	alldifferent([andrew_computer_index, computer_index_1, computer_index_2, computer_index_3, computer_index_4])
	/\ monitor_values[monitor_indexes[andrew_computer_index]] != 270
	/\ processor_values[processor_indexes[computer_index_1]] = 20
	/\ hard_disk_values[hard_disk_indexes[computer_index_2]] = 250
	/\ price_values[price_indexes[computer_index_3]] = 1149
	/\ monitor_values[monitor_indexes[computer_index_4]] != 150
	/\ hard_disk_values[hard_disk_indexes[computer_index_4]] > hard_disk_values[hard_disk_indexes[andrew_computer_index]]
	/\ processor_values[processor_indexes[computer_index_5]] = 27
	/\ hard_disk_values[hard_disk_indexes[computer_index_4]] < hard_disk_values[hard_disk_indexes[computer_index_5]]
);

% 3. The computer with the 320 Gb HD has either the 2.0 or the 2.3 MHz processor.
% The processor of the computer which has the 15' screen is more powerful 
% than the one in the computer that costs 999 euros but less powerful 
% than the processor that is included in the 1,349 Euros computer.
constraint exists
(
	computer_index_1 in computer_indexes, 
	computer_index_2 in computer_indexes, 
	computer_index_3 in computer_indexes, 
	computer_index_4 in computer_indexes
)
(
	hard_disk_values[hard_disk_indexes[computer_index_1]] = 320
	/\ member([20, 23], processor_values[processor_indexes[computer_index_1]])
	/\ monitor_values[monitor_indexes[computer_index_2]] = 150
	/\ processor_values[processor_indexes[computer_index_2]] > processor_values[processor_indexes[computer_index_3]]
	/\ price_values[price_indexes[computer_index_3]] = 999
	/\ processor_values[processor_indexes[computer_index_2]] < processor_values[processor_indexes[computer_index_4]]
	/\ price_values[price_indexes[computer_index_4]] = 1349
);

% 4. The computer that has the 27' screen doesn't have the 320 Gb hard drive. 
% The 500 GB HD is included in the computer that has a more powerful processor and a larger size screen 
% than the one which costs 699 euros (which doesn't include the 320 Gb HD).
constraint exists
(
	computer_index_1 in computer_indexes, 
	computer_index_2 in computer_indexes, 
	computer_index_3 in computer_indexes
)
(
	monitor_values[monitor_indexes[computer_index_1]] = 270
	/\ hard_disk_values[hard_disk_indexes[computer_index_1]] != 320
	/\ hard_disk_values[hard_disk_indexes[computer_index_2]] = 500
	/\ processor_values[processor_indexes[computer_index_2]] > processor_values[processor_indexes[computer_index_3]]
	/\ monitor_values[monitor_indexes[computer_index_2]] > monitor_values[monitor_indexes[computer_index_3]]
	/\ price_values[price_indexes[computer_index_3]] = 699
	/\ hard_disk_values[hard_disk_indexes[computer_index_3]] != 320
);

function string: format_decimal(var int: x) = "\(x div 10).\(x mod 10)";
output 
[
	"PC: \(i), CPU: \(format_decimal(processor_values[processor_indexes[i]])) MHz, HD: \(hard_disk_values[hard_disk_indexes[i]]) Gb"
	++ ", price: $ \(price_values[price_indexes[i]]), monitor: \(format_decimal(monitor_values[monitor_indexes[i]])) In\n" | i in computer_indexes
];
output ["andrew_computer_index: PC \(andrew_computer_index)\n"];