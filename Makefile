.PHONY: clean

clean:
	@echo "Nothing to do..."

rbc.js: rbc.ts
	tsc $^
