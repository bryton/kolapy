text_file = open('symbols_unfiltered.txt', 'r')
symbol_list = ['["']
for line in text_file:
    symbol_list.append(line.partition(';')[0])
    symbol_list.append('", "')

del symbol_list[-1]
symbol_list.append('"]')
print ''.join(symbol_list)