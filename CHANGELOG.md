# Changelog

## [2.5.0](https://github.com/cheminfo/common-spectrum/compare/v2.4.0...v2.5.0) (2024-03-04)


### Features

* add method AnalysesManager.fromJSON ([b06ee05](https://github.com/cheminfo/common-spectrum/commit/b06ee057fa877483ed20cde60aaa478044ff1ed4))

## [2.4.0](https://github.com/cheminfo/common-spectrum/compare/v2.3.0...v2.4.0) (2024-01-08)


### Features

* update dependencies and use new jcampconverter ([0e2c1b6](https://github.com/cheminfo/common-spectrum/commit/0e2c1b6d55e98c28537654d94b5f21074919ff0f))

## [2.3.0](https://github.com/cheminfo/common-spectrum/compare/v2.2.1...v2.3.0) (2023-08-22)


### Features

* update dependencies ([b37e95c](https://github.com/cheminfo/common-spectrum/commit/b37e95c85a5fc173d1c7419aa9de98dc36a47dc1))


### Bug Fixes

* update baselines to solve node16 module resolution problem ([cddc37f](https://github.com/cheminfo/common-spectrum/commit/cddc37fb2d64116671232101c209437796566f68))

### [2.2.1](https://www.github.com/cheminfo/common-spectrum/compare/v2.2.0...v2.2.1) (2022-07-11)


### Bug Fixes

* deal correctly with getDistinctLabelUnits and empty units ([e1faad7](https://www.github.com/cheminfo/common-spectrum/commit/e1faad7ab2a58bc89fcb1233b2a3b9db3f0b3845))

## [2.2.0](https://www.github.com/cheminfo/common-spectrum/compare/v2.1.0...v2.2.0) (2022-07-11)


### Features

* add getDistinctLabelUnits ([2de5099](https://www.github.com/cheminfo/common-spectrum/commit/2de5099969145691e6e05784d9583a205dcf1cce))

## [2.1.0](https://www.github.com/cheminfo/common-spectrum/compare/v2.0.0...v2.1.0) (2022-06-22)


### Features

* add 'id' to all the spectra and add methods to retrie them ([3f15a51](https://www.github.com/cheminfo/common-spectrum/commit/3f15a5152e93148864eb0f95a6ac68079fdeb829))
* add getNormalizedSpectra ([2351ce1](https://www.github.com/cheminfo/common-spectrum/commit/2351ce1dc87e3cfd2f5fabbf0cfb46ab9af9d2b4))
* add gewtXYSpectra ([3924195](https://www.github.com/cheminfo/common-spectrum/commit/3924195255ce3df93f72224521e32555f835eb7c))
* getJSGraph returns now all the matching series ([70e49e0](https://www.github.com/cheminfo/common-spectrum/commit/70e49e0a23cd2ac5eb53f78ca10f08fdf293e429))

## [2.0.0](https://www.github.com/cheminfo/common-spectrum/compare/v1.0.2...v2.0.0) (2022-06-22)


### ⚠ BREAKING CHANGES

* peak picking use 'shape' parameter

### Features

* peak picking use 'shape' parameter ([08d8150](https://www.github.com/cheminfo/common-spectrum/commit/08d81508f3fa7d6f96490b0190a76064335e81b1))

### [1.0.2](https://www.github.com/cheminfo/common-spectrum/compare/v1.0.1...v1.0.2) (2022-05-04)


### Bug Fixes

* update jcampconverter and fix tests ([a4a7995](https://www.github.com/cheminfo/common-spectrum/commit/a4a7995061c12e62e9a4f52501bc7ed44abc5ca1))

### [1.0.1](https://www.github.com/cheminfo/common-spectrum/compare/v1.0.0...v1.0.1) (2022-04-13)


### Bug Fixes

* remove ResultType to allow ts transpillation ([8f68400](https://www.github.com/cheminfo/common-spectrum/commit/8f68400ee5ea4ea9971ec4ea3c46f303062e29e1))

## [1.0.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.44.0...v1.0.0) (2022-04-13)


### ⚠ BREAKING CHANGES

* bump major version because filters name (normalization)  may have changed and peak picking does not give the same result

### Features

* add ml-signal-processing dependency ([e9852eb](https://www.github.com/cheminfo/common-spectrum/commit/e9852eb13caa57d588e6ba5c2aa2e2f53da5e43c))
* improve typescript definition ([e9852eb](https://www.github.com/cheminfo/common-spectrum/commit/e9852eb13caa57d588e6ba5c2aa2e2f53da5e43c))
* small breaking changes in peak picking and auto peak picking that can lead to different results (new ml-gsd) ([e9852eb](https://www.github.com/cheminfo/common-spectrum/commit/e9852eb13caa57d588e6ba5c2aa2e2f53da5e43c))
* update all dependencies ([e9852eb](https://www.github.com/cheminfo/common-spectrum/commit/e9852eb13caa57d588e6ba5c2aa2e2f53da5e43c))


### Miscellaneous Chores

* bump major version because filters name (normalization)  may have changed and peak picking does not give the same result ([9728be1](https://www.github.com/cheminfo/common-spectrum/commit/9728be144f07824624db2e363337028b8efca13b))
* release-as v1.0.0 ([019477a](https://www.github.com/cheminfo/common-spectrum/commit/019477a86ef93e07c32e55c7492269bf3cb133fb))

## [0.44.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.43.2...v0.44.0) (2022-03-15)


### ⚠ BREAKING CHANGES

* rename interfaces based on cheminfo-types

### Features

* rename interfaces based on cheminfo-types ([2a2d4d9](https://www.github.com/cheminfo/common-spectrum/commit/2a2d4d926e242f15476fafb8de3f623eec941cfb))


### Bug Fixes

* avoid reverse data in place ([45d9658](https://www.github.com/cheminfo/common-spectrum/commit/45d96586dd41a55b8ab0508b79d9caf4c44a3bc8))
* remove ts-ignore comments and regex match ([#78](https://www.github.com/cheminfo/common-spectrum/issues/78)) ([8ed0c54](https://www.github.com/cheminfo/common-spectrum/commit/8ed0c54747efd0441a1246b024e1bbf5e2618d70))
* this is a temporary fix that brings all the types in the project waiting for full migration to analysis ([a48e2f6](https://www.github.com/cheminfo/common-spectrum/commit/a48e2f6b4f6204d64086ac3d198daaf6f381bcfc))

### [0.43.2](https://www.github.com/cheminfo/common-spectrum/compare/v0.43.1...v0.43.2) (2021-09-28)


### Bug Fixes

* add @types/react ad developper dependency ([9331f50](https://www.github.com/cheminfo/common-spectrum/commit/9331f50f0862071c9b4020bb88627a9c28d41ef4))

### [0.43.1](https://www.github.com/cheminfo/common-spectrum/compare/v0.43.0...v0.43.1) (2021-09-26)


### Bug Fixes

* define react-plot as a dependency ([ce65110](https://www.github.com/cheminfo/common-spectrum/commit/ce651102b7977bbe25a605341b9568d60facae0b))

## [0.43.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.42.0...v0.43.0) (2021-09-26)


### ⚠ BREAKING CHANGES

* Always extract units from label
* getReactPlotJSON does not repeat units in label
* Rename SpectrumType to Spectrum and enforce the presence of variables 'x' and 'y'
* rename VariableType to SpectrumVariable and SelectorType to SpectrumSelector

### Features

* Always extract units from label ([6e5da98](https://www.github.com/cheminfo/common-spectrum/commit/6e5da98b6263a83f8313cb49cd1dfa0ec2ac9ca0))
* getReactPlotJSON does not repeat units in label ([f0cb4ff](https://www.github.com/cheminfo/common-spectrum/commit/f0cb4ff6ae6eeb48922bb70d35e1d8f2fe1cf0e6))
* Rename SpectrumType to Spectrum and enforce the presence of variables 'x' and 'y' ([52123c0](https://www.github.com/cheminfo/common-spectrum/commit/52123c0b7c0fadd120f2fe5e82178b133442c131))
* rename VariableType to SpectrumVariable and SelectorType to SpectrumSelector ([f9bdc1f](https://www.github.com/cheminfo/common-spectrum/commit/f9bdc1f311ca6dd893740003389dd9942c03b6d3))

## [0.42.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.41.0...v0.42.0) (2021-09-17)


### Features

* VariableType allows to have isDependent property ([3bc0865](https://www.github.com/cheminfo/common-spectrum/commit/3bc08652bdc000131cac615fad85217b363538f5))

## [0.41.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.40.0...v0.41.0) (2021-09-16)


### Features

* expose types ([ba7b241](https://www.github.com/cheminfo/common-spectrum/commit/ba7b241205e6d0b8f7d2b77d474b8dabfd4eafd4))

## [0.40.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.39.0...v0.40.0) (2021-07-20)


### Features

* deal correctly with linked jcamps ([cd7ca08](https://www.github.com/cheminfo/common-spectrum/commit/cd7ca08ae112ef7e52cea9de360f7a1d7fae874e))

## [0.39.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.38.0...v0.39.0) (2021-07-14)


### Features

* add fromText ([35872f6](https://www.github.com/cheminfo/common-spectrum/commit/35872f69106f4d4bf3d3f2f51b395a1757e5311e))

## [0.38.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.37.0...v0.38.0) (2021-07-12)


### Features

* optimize manually picked peaks ([#67](https://www.github.com/cheminfo/common-spectrum/issues/67)) ([8b062f7](https://www.github.com/cheminfo/common-spectrum/commit/8b062f7fda62e843f981cf18dfc05dace8837c08))

## [0.37.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.36.0...v0.37.0) (2021-06-18)


### Features

* add more options in autoPeakPicking ([00505cb](https://www.github.com/cheminfo/common-spectrum/commit/00505cb256ccdd3758bad628ac24e280a3590607))

## [0.36.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.35.0...v0.36.0) (2021-05-27)


### Features

* allow jcamp to be an ArrayBuffer ([945199b](https://www.github.com/cheminfo/common-spectrum/commit/945199b6313c0c6d904c622a38b42c7d9f187f62))


### Bug Fixes

* update dependencies and solve nD problem ([ebc03c2](https://www.github.com/cheminfo/common-spectrum/commit/ebc03c2f89d09b3ce24dbd8cb58e631efb15c42b))

## [0.35.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.34.0...v0.35.0) (2021-05-19)


### Features

* add options for autoPeakPicking and from/to ([aa22609](https://www.github.com/cheminfo/common-spectrum/commit/aa22609fc146d315d637e828f3775f79b0ff76e3))

## [0.34.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.33.0...v0.34.0) (2021-05-05)


### Features

* update dependency and allow to store metadata object in jcamp ([107d1eb](https://www.github.com/cheminfo/common-spectrum/commit/107d1ebda5e7394fd1a5fd9a9ad555f434f19792))

## [0.33.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.32.0...v0.33.0) (2021-04-27)


### Features

* update jcamp dependencies to deal with meta.cheminfo property ([52d4490](https://www.github.com/cheminfo/common-spectrum/commit/52d4490115c3df27289b0be8c1da53222788530a))

## [0.32.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.31.0...v0.32.0) (2021-04-21)


### ⚠ BREAKING CHANGES

* series is renamed to content, allowing the addition of annotations

### Features

* update dependencies and react-plot ([#57](https://www.github.com/cheminfo/common-spectrum/issues/57)) ([07f5491](https://www.github.com/cheminfo/common-spectrum/commit/07f54919b2beee41d705651a5d3dd4ecb8a145b1))

## [0.31.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.30.1...v0.31.0) (2021-04-14)


### Features

* update and expose PlotObject config options ([#55](https://www.github.com/cheminfo/common-spectrum/issues/55)) ([cf08da0](https://www.github.com/cheminfo/common-spectrum/commit/cf08da08b53fab28d289eacee60919d64d5dc21b))

### [0.30.1](https://www.github.com/cheminfo/common-spectrum/compare/v0.30.0...v0.30.1) (2021-03-26)


### Bug Fixes

* put back type definition to allow build and doc generation ([10ebed9](https://www.github.com/cheminfo/common-spectrum/commit/10ebed932a6077e65dcb96750498c989e7a26f32))

## [0.30.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.29.0...v0.30.0) (2021-03-26)


### Features

* add autoPeakPicking(spectrum) ([2a7034c](https://www.github.com/cheminfo/common-spectrum/commit/2a7034cb8be68864f1990ad0454e945474b37e0b))
* refactor to expose peakPicking(spectrum) ([391b2ec](https://www.github.com/cheminfo/common-spectrum/commit/391b2ec3264c543d37a56bed3a928a643c77c68e))


### Bug Fixes

* move devdeps for simplification over dependents ([115caf3](https://www.github.com/cheminfo/common-spectrum/commit/115caf38235e82acfb0531b8395eb328d185926b))

## [0.29.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.28.0...v0.29.0) (2021-03-23)


### Features

* add Analysis.peakPicking ([332db57](https://www.github.com/cheminfo/common-spectrum/commit/332db573553169aaff51facaa960343448539640))

## [0.28.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.27.0...v0.28.0) (2021-03-23)


### Features

* add variables to the selector ([152c741](https://www.github.com/cheminfo/common-spectrum/commit/152c7417c0d3d5a9fbe33d1095cc254a17c8e90b))
* allow to use xVariable and yVariable as selector ([15c543a](https://www.github.com/cheminfo/common-spectrum/commit/15c543a6dd9a5226b1a48cebac9350893560a0fd))

## [0.27.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.26.1...v0.27.0) (2021-03-22)


### Features

* add spectrumCallback ([0a7e832](https://www.github.com/cheminfo/common-spectrum/commit/0a7e832ec454a28b6fe9bd3d3c52d6b276ef3765))

### [0.26.1](https://www.github.com/cheminfo/common-spectrum/compare/v0.26.0...v0.26.1) (2021-03-16)


### Bug Fixes

* export reactPlot separatelly from jsgraph ([6ae3041](https://www.github.com/cheminfo/common-spectrum/commit/6ae304191de4b18a8f2df091d11c484e4925135f))

## [0.26.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.25.1...v0.26.0) (2021-03-15)


### Features

* keep the units after filtering by user ([#42](https://www.github.com/cheminfo/common-spectrum/issues/42)) ([02eaa88](https://www.github.com/cheminfo/common-spectrum/commit/02eaa88a3b43e461d4504927e6589424e3dc42e4))

### [0.25.1](https://www.github.com/cheminfo/common-spectrum/compare/v0.25.0...v0.25.1) (2021-03-09)


### Bug Fixes

* rename typo ([#40](https://www.github.com/cheminfo/common-spectrum/issues/40)) ([12f569e](https://www.github.com/cheminfo/common-spectrum/commit/12f569ed76ec50def2c57376016b96cf4dc67bdf))

## [0.25.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.24.1...v0.25.0) (2021-03-05)


### Features

* add option to ensure growing on x axis ([#36](https://www.github.com/cheminfo/common-spectrum/issues/36)) ([be0f2b2](https://www.github.com/cheminfo/common-spectrum/commit/be0f2b2b73f16ff468c719698a27435ee2982522))


### Bug Fixes

* update release action ([#38](https://www.github.com/cheminfo/common-spectrum/issues/38)) ([42c4612](https://www.github.com/cheminfo/common-spectrum/commit/42c461220cb4a9e119903e72150f7693ab706c88))

### [0.24.1](https://www.github.com/cheminfo/common-spectrum/compare/v0.24.0...v0.24.1) (2021-03-04)


### Bug Fixes

* allow empty data as options ([#34](https://www.github.com/cheminfo/common-spectrum/issues/34)) ([0abd7b6](https://www.github.com/cheminfo/common-spectrum/commit/0abd7b6147a49d0cb630c26e7e9548d8cb5ca5b6))

## [0.24.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.23.0...v0.24.0) (2021-03-04)


### Features

* if log scale remove x<=0 point ([7d1a8ac](https://www.github.com/cheminfo/common-spectrum/commit/7d1a8ac502ffa27409a05e672d69299137ec197b))

## [0.23.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.22.0...v0.23.0) (2021-03-04)


### Features

* add filter that removes not crecent x values ([91eb815](https://www.github.com/cheminfo/common-spectrum/commit/91eb8155dba9bae6242ca622b268b12c1959f93d))


### Bug Fixes

* typo in normalizer filter ([b7d5336](https://www.github.com/cheminfo/common-spectrum/commit/b7d53362ebf13ffb3009f616d9036fb2bffca7de))

## [0.22.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.21.0...v0.22.0) (2021-03-04)


### Features

* export to csv ([#29](https://www.github.com/cheminfo/common-spectrum/issues/29)) ([d7fae5b](https://www.github.com/cheminfo/common-spectrum/commit/d7fae5b3f5184626f2ced561f150b05c81293fc1))


### Bug Fixes

* publish lib-esm in npm ([dbad0a1](https://www.github.com/cheminfo/common-spectrum/commit/dbad0a11cadb3fc6d01fa622576c6b25b46af59b))

## [0.21.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.20.0...v0.21.0) (2021-03-03)


### Features

* **getJSGraph:** add xAxis and yAxis options ([03b1245](https://www.github.com/cheminfo/common-spectrum/commit/03b1245502929ddee8493234dc007f4d9a29dfe5))
* migration to Typescript ([#25](https://www.github.com/cheminfo/common-spectrum/issues/25)) ([c953912](https://www.github.com/cheminfo/common-spectrum/commit/c953912a8c3a0bf50208cee42f43f9850491f206))


### Bug Fixes

* delete previous documentation ([18abd56](https://www.github.com/cheminfo/common-spectrum/commit/18abd566a93dfc64bf71f148c3917f806889ea1f))
* dependencies update removes inference error ([0dc8610](https://www.github.com/cheminfo/common-spectrum/commit/0dc8610d5506c0214b25d5a37315b2101ba3c47a))

## [0.20.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.19.0...v0.20.0) (2021-02-17)


### Features

* add Analysys.getXY ([230a374](https://www.github.com/cheminfo/common-spectrum/commit/230a3745210622fa868718a5ce4d7171afe127ae))
* add baseline filters ([7c39f87](https://www.github.com/cheminfo/common-spectrum/commit/7c39f87f7602dcb15653c666e800496d84aeb63c))
* added third derivative ([#23](https://www.github.com/cheminfo/common-spectrum/issues/23)) ([6c101b9](https://www.github.com/cheminfo/common-spectrum/commit/6c101b9e1f15aa50d10721c10a39f37479890023))

## [0.19.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.18.2...v0.19.0) (2021-02-09)


### Features

* Add JSGraph object ([1b0a3f4](https://www.github.com/cheminfo/common-spectrum/commit/1b0a3f4570cb9a6109eaa7728934f603c07001ca))
* allow to store `tmp` information in spectra ([794a1fd](https://www.github.com/cheminfo/common-spectrum/commit/794a1fd667a9b9d2a468f793479b654f92c0d96f))


### Bug Fixes

* missing export ([f5daa33](https://www.github.com/cheminfo/common-spectrum/commit/f5daa33691e917f550b62312d0b0993d5c27423f))

### [0.18.2](https://www.github.com/cheminfo/common-spectrum/compare/v0.18.1...v0.18.2) (2021-01-28)


### Bug Fixes

* add id to axis for reactPlot ([0219bc0](https://www.github.com/cheminfo/common-spectrum/commit/0219bc0e99a7062c39bebab0b9ccdc3846d9c04b))

### [0.18.1](https://www.github.com/cheminfo/common-spectrum/compare/v0.18.0...v0.18.1) (2021-01-27)


### Bug Fixes

* wrong iteration over reactPlot data ([fbab146](https://www.github.com/cheminfo/common-spectrum/commit/fbab1465cf943964007fb6174d7179c2187c5379))

## [0.18.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.17.0...v0.18.0) (2021-01-27)


### Features

* add configuration options for each component ([ad949e7](https://www.github.com/cheminfo/common-spectrum/commit/ad949e74fccb7743f87050cc05966717e453365e))


### Bug Fixes

* add default option for getReactPlot ([9bf160f](https://www.github.com/cheminfo/common-spectrum/commit/9bf160fa24a0983466a7915b010575deecd594e7))

## [0.17.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.16.1...v0.17.0) (2021-01-26)


### Features

* export metadata to reactplot ([12549df](https://www.github.com/cheminfo/common-spectrum/commit/12549dffd20139da269c4a33db37f212b6145e72))

### [0.16.1](https://www.github.com/cheminfo/common-spectrum/compare/v0.16.0...v0.16.1) (2021-01-25)


### Bug Fixes

* deployment of getReactPlot ([f3a2caf](https://www.github.com/cheminfo/common-spectrum/commit/f3a2caf0dcb1d4d0dd8d0ea8daa1ef2490150ff6))

## [0.16.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.15.0...v0.16.0) (2020-12-14)


### Features

* add function for multiple spectra retrieval ([0a9a56b](https://www.github.com/cheminfo/common-spectrum/commit/0a9a56b3ba156fa7093362f5fdaf20a47ce6067a))

## [0.15.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.14.0...v0.15.0) (2020-10-14)


### ⚠ BREAKING CHANGES

* getDistinct does not lowercase values

### Features

* getDistinct does not lowercase values ([94f162c](https://www.github.com/cheminfo/common-spectrum/commit/94f162cc6a04d1ef4ed2b090c90d44b2c9a2b131))

## [0.14.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.13.0...v0.14.0) (2020-10-14)


### Features

* add getDistinctLabels and getDistinctUnits ([7487200](https://www.github.com/cheminfo/common-spectrum/commit/748720032019f51649b28d04cdccc9a9d1a87396))

## [0.13.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.12.0...v0.13.0) (2020-10-13)


### Features

* add getDistinctDataTypes, getDistinctTitles, getDistinctMeta ([6266b68](https://www.github.com/cheminfo/common-spectrum/commit/6266b68b5a9aa2347d0af6491865293e0a7bc697))

## [0.12.0](https://www.github.com/cheminfo/common-spectrum/compare/v0.11.0...v0.12.0) (2020-10-13)


### Features

* add documentation ([53dcd86](https://www.github.com/cheminfo/common-spectrum/commit/53dcd863f3193928f49c2fef5f1f1c6b99b609d9))

## [0.11.0](https://github.com/cheminfo/common-spectrum/compare/v0.10.0...v0.11.0) (2020-10-13)


### Features

* **getXYSpectrum:** add dataType selector ([8bf6daa](https://github.com/cheminfo/common-spectrum/commit/8bf6daad8fb19bd7ac72ecbe8959801c104c0180))
* **getXYSpectrum:** allow empty units and multiple selector ([#6](https://github.com/cheminfo/common-spectrum/issues/6)) ([55a5c11](https://github.com/cheminfo/common-spectrum/commit/55a5c11ee24fdaeeb43594c599a69e124036126f))
* **getXYSpectrum:** filter by meta ([c648cc1](https://github.com/cheminfo/common-spectrum/commit/c648cc1f423497d4fb4f86ea21ef10595bac3d0e))
* **getXYSpectrum:** filter by title ([4accebf](https://github.com/cheminfo/common-spectrum/commit/4accebfb78cbb267ce6601030af0ab983a85708e))
* getXYSpectrum use regexp for xLabel and yLabel ([84ccf93](https://github.com/cheminfo/common-spectrum/commit/84ccf931211c5ed92003859ec989233bd8e79fb8))
* label filter and updated dependencies (QUESTION)  ([#3](https://github.com/cheminfo/common-spectrum/issues/3)) ([2af52e2](https://github.com/cheminfo/common-spectrum/commit/2af52e29f59c7a0941c6a3c039a6192d0d7ebb5f)), closes [#2](https://github.com/cheminfo/common-spectrum/issues/2)

# [0.10.0](https://github.com/cheminfo/common-spectrum/compare/v0.9.0...v0.10.0) (2020-09-22)


### Features

* add baseline correction filter ([f95c98b](https://github.com/cheminfo/common-spectrum/commit/f95c98b5b79ed7f2bb5cc369c84194f12ec82174))
* add toJcamps ([2e32ac2](https://github.com/cheminfo/common-spectrum/commit/2e32ac2237e15b1d87569621576bbe6f8e9536ff))



# [0.9.0](https://github.com/cheminfo/common-spectrum/compare/v0.8.0...v0.9.0) (2020-08-13)


### Bug Fixes

* eslint ([a34700d](https://github.com/cheminfo/common-spectrum/commit/a34700ddc55ab69cc967ae8d8cceea42b9b9952d))
* space in first / second derivative label ([0a78537](https://github.com/cheminfo/common-spectrum/commit/0a7853790257ef62a9d1d213ecff9816323fb022))


### Features

* add AnalysesManager.removeAllAnalyses ([94e79ab](https://github.com/cheminfo/common-spectrum/commit/94e79ab8a6fcd7abd56804c4f8d5eca2c9e9958b))
* add opacities and linesWidth as style options of getJSGraph ([4477f7e](https://github.com/cheminfo/common-spectrum/commit/4477f7e3aa07d01a1023cf397b2d9b7a23e5b0c0))



# [0.8.0](https://github.com/cheminfo/common-spectrum/compare/v0.7.0...v0.8.0) (2020-08-04)


### Features

* getNormalizedSpectrum ([5ebaeaf](https://github.com/cheminfo/common-spectrum/commit/5ebaeaf58719d18e6042a7f1fb8dc15cd34daf17))



# [0.7.0](https://github.com/cheminfo/common-spectrum/compare/v0.6.0...v0.7.0) (2020-08-04)


### Features

* add getXY to get the data for a specific unit ([14eaf05](https://github.com/cheminfo/common-spectrum/commit/14eaf055688bfccb4766680ea5266ce2fb5a01c1))
* add isMonotone to all variables ([177c676](https://github.com/cheminfo/common-spectrum/commit/177c6760b18feda7cac092cb3db3c16469acc611))
* allow °C to be converted to K ([e7e2088](https://github.com/cheminfo/common-spectrum/commit/e7e208858991783156abc785fbc029a3d82690fa))
* allows to use 'units' as selector ([c3aa20a](https://github.com/cheminfo/common-spectrum/commit/c3aa20ade25f494abcaf6e755ef57e0ece20d37c))
* refactor and add getXYSpectrum ([8f90667](https://github.com/cheminfo/common-spectrum/commit/8f9066703c6ac8b62b54b2cfd0dad876b08fcd39))
* return full spectrum with getXY ([181f824](https://github.com/cheminfo/common-spectrum/commit/181f8242fcfdd2e80c64054a25127236ade4ac84))



# [0.6.0](https://github.com/cheminfo/common-spectrum/compare/v0.5.0...v0.6.0) (2020-07-29)



# [0.5.0](https://github.com/cheminfo/common-spectrum/compare/v0.4.1...v0.5.0) (2020-07-15)


### Bug Fixes

* set correct default value for min / max ([816d9ad](https://github.com/cheminfo/common-spectrum/commit/816d9ada3feacf5d7b2884d51e58ef551abdf953))


### Features

* add min, max for variables and isMonotone for x variable ([a019543](https://github.com/cheminfo/common-spectrum/commit/a019543ca8f03eb46c99a8c9308c8e76d086ce33))
* use real min / max to evaluate from / to when normalizing data ([58c8341](https://github.com/cheminfo/common-spectrum/commit/58c8341d0342ea2eecfe472bf35f904844077278))



## [0.4.1](https://github.com/cheminfo/common-spectrum/compare/v0.4.0...v0.4.1) (2020-07-01)


### Bug Fixes

* add missing dependency ([c12bad3](https://github.com/cheminfo/common-spectrum/commit/c12bad3020e4270537c9b1b69f5d5c9d8fdb6b43))



# [0.4.0](https://github.com/cheminfo/common-spectrum/compare/v0.3.1...v0.4.0) (2020-07-01)


### Features

* add filters dividebymax, multiply, add ([5afe57e](https://github.com/cheminfo/common-spectrum/commit/5afe57e40ad67f8a3502bc7737d0c5ba6df54f3b))



## [0.3.1](https://github.com/cheminfo/common-spectrum/compare/v0.3.0...v0.3.1) (2020-06-24)



# [0.3.0](https://github.com/cheminfo/common-spectrum/compare/v0.2.0...v0.3.0) (2020-06-24)


### Features

* update dependencies to allow multivariate ([95150d6](https://github.com/cheminfo/common-spectrum/commit/95150d6de43cc11259f53ac51ecd8c1efe0e4412))



# [0.2.0](https://github.com/cheminfo/common-spectrum/compare/v0.1.2...v0.2.0) (2020-06-20)


### Features

* deal correctly with ntuples (takes first spectrum) ([b5110f5](https://github.com/cheminfo/common-spectrum/commit/b5110f5441b3e0aa28dc73a0f94e0181b50bb7f8))



## [0.1.2](https://github.com/cheminfo/common-spectrum/compare/v0.1.1...v0.1.2) (2020-06-16)


### Bug Fixes

* returns all spectra if flavor is empty string ([2c70c70](https://github.com/cheminfo/common-spectrum/commit/2c70c709dd7ce5de293728c8618fae4a11fc8ced))



## [0.1.1](https://github.com/cheminfo/common-spectrum/compare/v0.1.0...v0.1.1) (2020-06-16)


### Bug Fixes

* unmit duplication in jcamp ([c535ea8](https://github.com/cheminfo/common-spectrum/commit/c535ea86929d2a32b37583c2506503f3323fe4cd))



# [0.1.0](https://github.com/cheminfo/common-spectrum/compare/v0.0.2...v0.1.0) (2020-06-12)


### chore

* refactor to array ([d677dcc](https://github.com/cheminfo/common-spectrum/commit/d677dcc32e98d6ef04023e4ebe84c35e414fcd6a))


### BREAKING CHANGES

* spectra is now an array of spectrum that contains
the flavor.

Flavor is generated automatically from xUnits and yUnits



## [0.0.2](https://github.com/cheminfo/common-spectrum/compare/v0.0.1...v0.0.2) (2020-06-02)



## 0.0.1 (2020-05-29)
