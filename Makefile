serve:
	npm run start

%:
	npm run $*

RELEASE = "sww-v`scripts/get-version.sh version`"
release: build build-debug
	rm -rf $(RELEASE)
	cp -R dist $(RELEASE)
	zip -r $(RELEASE).zip $(RELEASE)
	rm -rf $(RELEASE)
