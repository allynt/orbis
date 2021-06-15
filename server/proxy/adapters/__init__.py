from glob import glob
from importlib import import_module
from os.path import basename, dirname, join

# only expose PROXY_DATA_ADAPTER_REGISTRY from adapters_base,
# but still import the other modules so that they all get registered

from .adapters_base import PROXY_DATA_ADAPTER_REGISTRY

[
    import_module(f".{module[:-3]}", __name__) for module in [
        basename(module_path)
        for module_path in glob(join(dirname(__file__), "*.py"))
    ] if not module.startswith("_")
]
