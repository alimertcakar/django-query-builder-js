A neat way to build django query params with auto completion. Fully typed.

buildQueryParams().status().**in([1, 2, 3, 4]).parse()
prints -> { status**in=1,2,3,4 }

buildQueryParams().name("John").**iexact().parse()
prints -> { name**iexact: 'John' }
