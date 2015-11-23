.PHONY: all clean watch

JEKYLL := $(shell which jekyll)
NODE := $(shell which node)
LESSC := node_modules/.bin/lessc
POSTCSS := _scripts/postcss.js

lessfiles := $(shell find css/ -name "*.less")
cssfiles := $(lessfiles:%.less=%.css)

all: $(cssfiles) .build/postcss build

build:
	$(JEKYLL) build

%.css: %.less
	@echo "- LESS:" $< "->" $@
	@$(LESSC) --include-path=css/ $< > $@

.build/postcss: $(allcss) $(cssfiles)
	@echo "- postcss:" $?
	@$(NODE) $(POSTCSS) --use autoprefixer --replace $?
	@touch $@

clean:
	rm $(allcss)
	rm -f .build/*

watch:
	@./_scripts/watch

