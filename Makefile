PUBLISH_TARGET = 

# non-versioned include
-include vars.mk

JEKYLL := $(shell which jekyll)
NODE := $(shell which node)
LESSC := node_modules/.bin/lessc
POSTCSS := _scripts/postcss.js
VERSION_SCRIPT := _scripts/version

DESKTOP_VERSION = $(shell cat ../desktop/package.json \
					| grep '"version"' \
					| sed 's|.*: \+"\([^"]\+\)".*|\1|')
MOBILE_VERSION = $(shell cat ../mobile/config.xml \
					| grep '^<widget' \
					| sed 's|^.*version="\([^"]\+\)".*|\1|')

lessfiles := $(shell find css/ -name "*.less")
cssfiles := $(lessfiles:%.less=%.css)

.PHONY: all clean watch release-all

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

release-all:
	@echo -ne "\n\n--- Building desktop release $(DESKTOP_VERSION) ---\n\n"
	@sleep 2
	cd ../desktop && make release
	@cp ../desktop/release/turtl-* ./releases/desktop
	$(VERSION_SCRIPT) desktop $(DESKTOP_VERSION)

	@echo -ne "\n\n--- Building mobile release $(MOBILE_VERSION) ---\n\n"
	@sleep 2
	cd ../mobile && make release-android && make release-fdroid
	@cp ../mobile/platforms/android/build/outputs/apk/android-armv7-release.apk ./releases/mobile/turtl-android.apk
	$(VERSION_SCRIPT) mobile $(MOBILE_VERSION)

	@echo -ne "\n\n--- Building jekyl site ---\n\n"
	@make

publish:
	_scripts/publish.sh $(PUBLISH_TARGET)

clean:
	rm $(allcss)
	rm -f .build/*

watch:
	@./_scripts/watch

