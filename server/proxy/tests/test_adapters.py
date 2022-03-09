import pytest

from proxy.adapters.adapters_pld import PldAdapter
from proxy.adapters.adapters_wfc_dashboard import WFCDashboardAdapter


class TestPldAdapter:
    @pytest.mark.skip()
    def test_pld_adapter(self):
        adapter = PldAdapter()
        transformed_data = adapter.process_data(adapter.SAMPLE_DATA)

        assert transformed_data["type"] == "FeatureCollection"

        for feature in transformed_data["features"]:
            assert feature.get("geometry") is not None
            assert feature.get("properties") is not None

class TestWFCDashboardAdapter:
    def test_wfc_dashboard_adapter(self):
        adapter = WFCDashboardAdapter()
        transformed_data = adapter.process_data(adapter.SAMPLE_DATA)

        assert False
