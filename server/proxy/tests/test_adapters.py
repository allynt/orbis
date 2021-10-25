from proxy.adapters.adapters_pld import PldAdapter


class TestPldAdapter:
    def test_pld_adapter(self):
        adapter = PldAdapter()
        transformed_data = adapter.process_data(adapter.SAMPLE_DATA)

        assert transformed_data["type"] == "FeatureCollection"

        for feature in transformed_data["features"]:
            assert feature.get("geometry") is not None
            assert feature.get("properties") is not None
